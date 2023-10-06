import { AllHullTypes, Spaceship } from "./Spaceship"

export type OrbitParams = {
    radius: number;// for now - only circular
    curAngle: number; // where we are in the orbit
    Vorb?: number;
    Omega?: number;
}

export class Orbiting {
    _id?: string;
    parentId?: string
    parent?: Orbiting
    orbit: OrbitParams
    children: Orbiting[]

    constructor(orbit?:OrbitParams, parent?:Orbiting) {
        this.orbit = orbit
        this.parent = parent
        this.children = []
    }

    toDecart(global:boolean):{x:number,y:number} {
        if (!this.parent) return {x:0,y:0}
        const pc = (global === true) ? this.parent.toDecart(global) : {x:0,y:0}
        return {
            x: pc.x + (this.orbit.radius * Math.cos(this.orbit.curAngle)),
            y: pc.y + (this.orbit.radius * Math.sin(this.orbit.curAngle))
        }
    }

    advanceOrbit(t:number) {
        if (this.parent) {
            this.orbit.curAngle += this.orbit.Omega * t;
            if (this.orbit.curAngle > 2*Math.PI) this.orbit.curAngle -= 2*Math.PI
        }
        this.children.forEach(c => c.advanceOrbit(t))
    }
}

export class AstroBody extends Orbiting {
    static G = 6.67e-11;
    name: string;
    mass: number;
    radius: number;
    GM: number; // handy for calculating force
    gOnSurface: number;

    constructor(props:{
        name: string,
        mass: number,
        radius: number,
        parent?: AstroBody,
        orbit?: OrbitParams
    }) {
        super(props.orbit, props.parent)
        this.name = props.name;
        this.mass = props.mass;
        this.radius = props.radius;
        this.GM = AstroBody.G * props.mass;
        this.gOnSurface = this.GM / this.radius / this.radius
    }


    findChildByName(nm:string):AstroBody {
        //console.log("Looking for ", nm)
        if (this.name === nm) return this
        let ret = null
        this.children.forEach(c=> {
            //console.log("Looking in: ", c)
            if ( (c as AstroBody).name === nm) ret = c
            c.children.forEach(c1=> {
                if ( (c1 as AstroBody).name === nm) ret = c1
            })
        })
        return ret
    }
    /**
     * 
     * @param body 
     * @returns this for chaining
     */
    addChild(body:Orbiting, radius:number, angle:number):AstroBody {
        body.parent = this;
        const vorb = Math.sqrt(this.GM / radius)
        body.orbit = {
            Vorb: vorb,
            Omega: vorb / radius,
            radius: radius,
            curAngle: angle
        }
        this.children.push(body)
        return this;
    }

    calculateAccInThisAndChildren(props:{
        x: number,
        y: number
    }) {
        const {x,y} = props
        const r2 = (x*x + y*y)
        let accs = [{
            name: this.name,
            acc: this.GM / r2,
            angle: Math.atan(y/x) 
        }]

        return accs;

    }

    // simulating the rocket coordinates in the gravity field
    // of this body and its children only (no grandchildren), in the coordinates
    // relative to this body only.
    simulateRocketInThisAndChildren(props:{
        x: number,
        y: number,
        vx: number,
        vy: number,
        m: number,
        thrust: number,
        thrustAngle: number,
        t: number, // total time to simulate
        dt: number // dt to use in calculations
    }) {

    }

}

