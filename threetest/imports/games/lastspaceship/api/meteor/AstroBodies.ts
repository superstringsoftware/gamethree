import { AstroBody, OrbitParams } from "../model/Astro";
import { Spaceship } from "../model/Spaceship";
import { ColShips } from "./Player";


/**
 * The idea is - all astronomic bodies must be orbiting something
 * Ships can also free fly
 * From this persistent info we setup systems inside the model
 */
export interface IAstroBodyData {
    _id?: string,
    code: string,
    name: string,
    description: string,
    type: "star" | "planet" | "moon" | "asteroid",
    parentId?: string, // id of where we are orbiting around
    // decart coordinates in the galaxy, for STARS and their level objects only
    galX?: number,
    galY?: number,
    radius: number,
    mass: number,
    childrenIds: string[], // if has children orbiting bodies - them
    orbit?: OrbitParams,
    currentShipIds: string[], // current ships either in orbit or free movement
    // in case this is a star, we separately keep ALL ids of stuff inside -
    // for faster publishing:
    allChildrenIds?: string[],
    allShipIds?: string[]
}

export const shipFromId = (sid:string) => {
    const sd = ColShips.findOne({_id: sid})
        const sh = new Spaceship({
            hullData: sd.hd,
            transponder: sd.transponder,
            shipName: sd.shipName,
            description: sd.description
        })
        sh.transponderOn = sd.transponderOn
        // decart parameters
        sh.x = sd.x;
        sh.y = sd.y;
        sh.vx = sd.vx;
        sh.vy = sd.vy

        sh.thrust = sd.thrust
        sh.thrustAngle = sd.thrustAngle

        // if in flight:
        sh.originId = sd.originId
        sh.destinationId = sd.destinationId
        sh.dockedWithId = sd.dockedWithId

        // components
        sh.reactors = sd.reactors
        sh.sublightDrives = sd.sublightDrives
        sh.computer = sd.computer

        sh.orbit = sd.orbit
        sh._id = sd._id
        sh.ownerId = sd.ownerId
        return sh;
}

/**
 * Key method - creates object in memory that simulates the whole
 * star system from whatever we store in the db
 * @param ib 
 */
export const fromAstroBodyId = (id:string) => {
    const ib = ColAstrobodies.findOne({_id:id})
    if (!ib) {
        throw new Meteor.Error("not-found", "no body with id " + id)
    }
    return fromIAstroBodyData(ib)
}

export const fromIAstroBodyData = (ib:IAstroBodyData) => {
    const star = new AstroBody(ib)
    //console.log(ib)
    star._id = ib._id
    //console.log(star)
    ib.currentShipIds.forEach(sid => {
        const sh = shipFromId(sid)
        sh.parent = star
        star.addChild(sh, sh.orbit.radius, sh.orbit.curAngle)
    })
    ib.childrenIds.forEach(cid => {
        const c = ColAstrobodies.findOne({_id: cid})
        //console.log(c)
        const cb = new AstroBody(c)
        cb._id = cid
        star.addChild(cb, cb.orbit.radius, cb.orbit.curAngle)
        cb.parent = star
        c.currentShipIds.forEach(sid => {
            const sh = shipFromId(sid)
            sh.parent = cb
            cb.addChild(sh, sh.orbit.radius, sh.orbit.curAngle)
        })
        c.childrenIds.forEach(cid1 => {
            const c = ColAstrobodies.findOne({_id: cid1})
            //console.log(c)
            const cb1 = new AstroBody(c)
            cb1._id = cid1
            cb.addChild(cb1, cb1.orbit.radius, cb1.orbit.curAngle)
            cb1.parent = cb
            c.currentShipIds.forEach(sid => {
                const sh = shipFromId(sid)
                sh.parent = cb1
                cb1.addChild(sh, sh.orbit.radius, sh.orbit.curAngle)
            })
        })
    })
    return star;
}

export const ColAstrobodies = new Mongo.Collection<IAstroBodyData>("astrobodies")