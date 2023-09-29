/**
 * Implementation approach
 * 
 * We need to keep facilities lists by category.
 * Visualization is secondary, simulation is primary, that's why.
 * So, the algo for overall daily sim is roughly:
 * - Calculate all Resource Production and Consumption from Production buildings
 * - Calculate all remaining Consumption from all the other buildings
 * - Calculate surplus / insufficiency to be handled
 * - Calculate consumption for each SIM - which products / services they buy, this will also drive further Resource Consumption calculation
 * - Rearrange goods / money respectively
 * - Sim other SIM decisions - edu / jobs / moving / visiting etc
 */

export interface IResourceData {
    resource: string,
    quantity: number,
    dimension: string,
    comment?: string
}

export interface IJobRequirements 
{
    title: string,
    minEducation: number,
    minExperience: number,
    maxEducation: number,
    quantity: number,
    filledBy?: string[] // if a job is filled, array of IDs of sims who filled it
}

// base interface for any facility in the tower
export interface IBaseFacility {
    name: string,
    category: string,
    description: string,
    state: number, // how well maintained this is, 0-100
    startingSegment?: number, // in case it is built - starting segment within the floor
    // dimensions in sectors and floors (3 sectors is a square thingy)
    size: {
        sectors: number,
        floors: number
    },
    // base OPEX resource consumption - regardless of what else is in the facility or whether its operational or not
    baseConsumption: IResourceData[],
    // array of IDs of sims that are *currently* in the facility,
    // be they workers, inhabitants or just visitors
    currentSims?: string[]
}

// interface for habitable facility
export interface IHabitableFacility extends IBaseFacility {
    inhabitants: string[] // simply array of IDs
}

// interface for facility with job requirements
export interface IJobsFacility extends IBaseFacility {
    jobs: IJobRequirements[]
}

// interface for facility that produces something - but NOT mining, as it depends on external resources
export interface IProductionFacility extends IJobsFacility {
    production: {
        formulaDescription: string,
        resource: string, // what type of resource is being produced
        output: {
            min: number, // minimal possible production per day
            max: number, // maximum possible production per day
            dimension: string,
            // this is a bit tricky: how much resource is produced per one full array of consumption resources. So the way to calculate full input resource consumption is divide the current production levels by perResources number.
            perResources: number, 
            consumption: IResourceData[]
        }
    }
}

// floor state
export interface IFloorState {
    floorNumber: number, // 0 - ground, -1 - first underground etc
    facilities: IBaseFacility[] // simply array of built facilities with starting segment (leftmost is 0)
}

// tower state
export interface ITowerState {
    floors: IFloorState[]
}