/**
 * We represent the spherical bodies as a bunch of sectors, depending on size:
 *   *
 *  ***
 *   *
 * 
 * 
 *   **
 *  ****
 *  ****
 *   **
 * 
 * Ok for the start let's ignore this and just treat any planet as a list of sectors of the same area
 */

// just features relative to the "sea level", whether they are filled with water or not - separate matter
export type TTerrain = "mountains" | "hills" | "flats" | "shallow" | "deep"

// all kinds of resources, natural, flora, fauna, type of soil, rivers / lakes etc
export interface IResource {
    name: string,
    description: string,
    quantity: number,
    quality: number,
    depth?: number // for underground resources only, the deeper the more difficult to extract
}

export interface IClimate {
    minTemp: number,
    aveTemp: number,
    maxTemp: number,
    minWind: number,
    aveWind: number,
    maxWind: number,
    sunDays: number, // percentage
    humidity: number,
    precipitation: number
}

export interface IBuilding {
    name: string
}

export type TDistrictType = "habitation" | "farming" | "industry" | "mining" | "recreation"

export interface IDistrict {
    districtType: TDistrictType,
    name: string,
    buildings: IBuilding[]
}

// planet sector is a piece of land on the planet (moon etc)
// it contains natural resources and info, but then also 
// may contain 1 DISTRICT built by the player.
// In turn, District will contain different buildings.
export interface IPlanetSector {
    latitude: number, // influences weather
    longitude: number, // simply coordinates
    surfaceResources: IResource[],
    groundResources: IResource[],
    terrain: TTerrain,
    climate: IClimate,
    district?: IDistrict
}