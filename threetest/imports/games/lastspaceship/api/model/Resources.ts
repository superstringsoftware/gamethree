export type Maybe<T> = { just: T } | "nothing"
export function mfmap<T>(f, x:Maybe<T>) {
    if (x === "nothing") return "nothing"
    else return { just: f(x.just)}
}

export abstract class ShipPart {
    mass: number;
    size: number;

    constructor(m:number, s:number) {
        this.mass = m;
        this.size = s;
    }
}


export type Resource = {
    name: string,
    quality?: number,
    // current state of the thingy - whether we need to fix it
    // 0 - 100
    state?: number, 
    quantity?: number,
    // in case our thingy is comprised of other thingies - here's their list
    compoundParts?: Resource[]
}

export class Compoundable {
    _compounds: Compoundable[]
    mass: number

    constructor() {
        this.mass=0
        this._compounds=[]
    }

    getMass() {
        return this.mass;
    }
}