import { Vector2g } from "./Physics";


/**
 * NEW APPROACH: we are separating classes from interfaces that
 * define data types very clearly.
 * 
 * Any astronomical body with physical characteristics, starting point
 */
export interface IAstroBody {
    mass: number;
    coords: Vector2g; // local coordinates (if orbiting)
    coordsStar?: Vector2g; // coordinates relative to the star
    velocity?: Vector2g;
    orbit?: IOrbitParams; // if present - it's orbiting, if not it's not
}

export interface IGravityBody extends IAstroBody {
    name: string;
    description: string;
    code?: string;
    radius: number;
    GM?: number; // handy for calculating force
    gOnSurface?: number;
}

export interface IStarData extends IGravityBody {
    starClass?: string;
    surfaceTemp?: number;
}

export interface IPlanetoidData extends IGravityBody {
    type: "planet" | "moon" | "asteroid"
    // TBD: atmosphere, climate etc.
}

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