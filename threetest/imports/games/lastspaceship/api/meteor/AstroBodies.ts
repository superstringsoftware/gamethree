import { AstroBody, OrbitParams } from "../model/Astro";


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
}

export const fromIAstroBodyData = (ib:IAstroBodyData) => {
    const star = new AstroBody(ib)
    //console.log(ib)
    star._id = ib._id
    //console.log(star)
    ib.childrenIds.forEach(cid => {
        const c = ColAstrobodies.findOne({_id: cid})
        //console.log(c)
        const cb = new AstroBody(c)
        cb._id = cid
        star.addChild(cb, cb.orbit.radius, cb.orbit.curAngle)
        cb.parent = star
        c.childrenIds.forEach(cid1 => {
            const c = ColAstrobodies.findOne({_id: cid1})
            //console.log(c)
            const cb1 = new AstroBody(c)
            cb1._id = cid1
            cb.addChild(cb1, cb1.orbit.radius, cb1.orbit.curAngle)
            cb1.parent = cb
        })
    })
    return star;
}

export const ColAstrobodies = new Mongo.Collection<IAstroBodyData>("astrobodies")