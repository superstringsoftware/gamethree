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
    quantity: number
}

// base interface for any facility in the tower
export interface IBaseFacility {
    name: string,
    category: string,
    description: string,
    // dimensions in sectors and floors (3 sectors is a square thingy)
    size: {
        sectors: number,
        floors: number
    },
    // base OPEX resource consumption - regardless of what else is in the facility or whether its operational or not
    baseConsumption: IResourceData[]
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