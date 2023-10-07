import { Vector2g } from "./Physics";


/**
 * NEW APPROACH: we are separating classes from interfaces that
 * define data types very clearly.
 * 
 * Any astronomical body with physical characteristics, starting point
 */
export interface IAstroBody {
    _id?: string;
    mass: number;
    coords?: Vector2g; // local coordinates (if orbiting)
    coordsStar?: Vector2g; // coordinates relative to the star
    velocity?: Vector2g;
    orbit?: IOrbitParams; // if present - it's orbiting, if not it's not
    systemId?: string; // which system id it belongs to. if none -
    // coordinates are galactic coordinates
}

/**
 * Astro body with gravity and so radius
 */
export interface IGravityBody extends IAstroBody {
    name: string;
    description: string;
    code?: string;
    radius: number;
    GM?: number; // handy for calculating force
    gOnSurface?: number;
}

/**
 * stars
 */
export interface IStarData extends IGravityBody {
    starClass?: string;
    surfaceTemp?: number;
}

/**
 * star systems - used to store info in the Mongo db!
 * (so we will store Star together with star system to simplify things.)
 */
export interface IStarSystemData extends IStarData {
    //planetoidIds: string[],
    //shipIds: string[]
}

/**
 * Another descending tracck from gravity body - planetoids
 */
export interface IPlanetoidData extends IGravityBody {
    type: "planet" | "moon" | "asteroid"
    // TBD: atmosphere, climate etc.
}

/**
 * another descending trakc from Astrobody - ships (can have thrust)
 */
export interface IAstroShip extends IAstroBody {
    thrust?: Vector2g
}

/**
 * Very simple circular orbit, we'll add ellipses later
 */
export interface IOrbitParams {
    polar: Vector2g; // radius and angle written as vector
    Vorb?: number;
    Omega?: number;
    centerId?: string; // around what?
    centerBody?: IGravityBody
}