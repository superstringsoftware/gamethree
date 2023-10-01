// https://docs.google.com/spreadsheets/d/1V0ygoOzjEA_XTqSV4fD0C3f_RUdqYshmZxpgZBYElkQ/edit#gid=0

import { ResFunctions } from "./Resources"

export interface IJobRequirements 
{
    minEducation: number,
    quantity: number,
    title?: string,
    minExperience?: number,
    maxEducation?: number,
    filledBy?: string[] // if a job is filled, array of IDs of sims who filled it
}

// we treat ALL resources the same way

export interface IBaseBuilding {
    name: string,
    description: string,
    category: string,
    CAPEX: Array<{name:string, quantity: number}>,
    // fixed opex
    OPEX: Array<{name:string, quantity: number}>,
    // per sim opex
    OPEXPerSim: Array<{name:string, quantity: number}>,
    // fixed production
    Production: Array<{name:string, quantity: number}>,
    // per sim production
    ProductionPerSim: Array<{name:string, quantity: number}>,
    // which building and technology prerequisites exist before it can be built
    Prerequisites?: {
        buildings: string[], // in the current district
        tech: string[] // researched
    },
    // if the building is inhabitable
    inhabitants?: {
        maxNumber: number,
        current: string[] // array of sim ids that live here
    },
    maxInhabitants: number,
    // if the building is workable
    jobs: IJobRequirements[],
}

export interface IBuilding {
    template: IBaseBuilding,
    currentInhabitants: string[], // array of ids
    currentWorkers: string[][], // array of array of ids - to correspond to the array of JobRequirements!!!
}

// various functions to work on buildings, mainly production and consumption
export const BuildingFunctions = {

    CalculateProduction: (b: IBuilding, turns: number) => {

    },

    /**
     * calculating opex for a building
     */
    CalculateOPEX: (b: IBuilding, turns: number) => {
        let res = ResFunctions.MulScalar(b.template.OPEX, turns)
        if (b.currentInhabitants.length > 0) {
            // counting by inhabitants if its habitable...
            const ps = ResFunctions.MulScalar(b.template.OPEXPerSim, b.currentInhabitants.length * turns)
            res = ResFunctions.AddVectors(ps,res)
        }
        else {
            // counting by workers!
            let nw = 0
            b.currentWorkers.forEach( wa => nw += wa.length)
            if (nw > 0) {
                const ps = ResFunctions.MulScalar(b.template.OPEXPerSim, nw * turns)
                res = ResFunctions.AddVectors(ps,res)
            }
        }
        return res
    },

    /**
     * calculate opex for a list of buildings
     */
    CalculateOPEXList: (bs: IBuilding[], turns: number) => {
        const opexes = bs.map( b => BuildingFunctions.CalculateOPEX(b,turns))
        //console.log("Inside CalculateOPEXList")
        //console.log(opexes)
        return opexes.reduce((accumulator, currentValue) => 
            ResFunctions.AddVectors(accumulator,currentValue),
            [],)
    }
}

/**
 * Let's make core buildings hardcoded
 */

export const AllBuildings:IBaseBuilding[] = [
    {
        name: "Colony",
        description: "First settlement on the planet, serves as a capital eventually and as a Habitation district for building purposes.",
        category: "Capital",
        CAPEX: [],
        OPEX: [{name:"PD", quantity: 5}],
        OPEXPerSim: [{name:"PD", quantity: 1},
        {name:"Energy", quantity: 1}],
        Production: [{name:"Energy", quantity: 50}],
        ProductionPerSim: [{name:"PD", quantity: 30}],
        // which building and technology prerequisites exist before it can be built
        Prerequisites: {
            buildings: [], 
            tech: [] 
        },
        // if the building is inhabitable
        maxInhabitants: 10,
        // if the building is workable
        jobs: [{
            minEducation: 40,
            quantity: 2,
        }]
    },
    {
        name: "Village",
        description: "Smallest habitation on the planet. Can be built anywhere on earth-like environments. Biggest possible settlement in the low mountains.",
        category: "Habitation",
        CAPEX: [],
        OPEX: [{name:"PD", quantity: 10}],
        OPEXPerSim: [{name:"PD", quantity: 1},
            {name:"Energy", quantity: 1}],
        Production: [],
        ProductionPerSim: [{name:"PD", quantity: 30}, 
            {name:"Money", quantity: 1}],
        // which building and technology prerequisites exist before it can be built
        Prerequisites: {
            buildings: [], 
            tech: [] 
        },
        // if the building is inhabitable
        maxInhabitants: 25,
        // if the building is workable
        jobs: [{
            minEducation: 40,
            quantity: 4,
        },
        {
            minEducation: 60,
            quantity: 1,
        }]
    },
    {
        name: "Town",
        description: "What your village grows into. Bigger, more dynamic. Biggest possible settlement on high hills",
        category: "Habitation",
        CAPEX: [],
        OPEX: [{name:"PD", quantity: 20}],
        OPEXPerSim: [{name:"PD", quantity: 1.5},
            {name:"Energy", quantity: 1.5}],
        Production: [],
        ProductionPerSim: [{name:"PD", quantity: 50}, 
            {name:"Money", quantity: 1.5}],
        // which building and technology prerequisites exist before it can be built
        Prerequisites: {
            buildings: ["Village"], 
            tech: [] 
        },
        // if the building is inhabitable
        maxInhabitants: 100,
        // if the building is workable
        jobs: [{
            minEducation: 40,
            quantity: 15,
        },
        {
            minEducation: 60,
            quantity: 5,
        },
        {
            minEducation: 70,
            quantity: 1,
        }]
    },
    {
        name: "City",
        description: "Roughly a couple of million inhabitants city by earth standards. Biggest possible settlement on hills.",
        category: "Habitation",
        CAPEX: [],
        OPEX: [{name:"PD", quantity: 50}],
        OPEXPerSim: [{name:"PD", quantity: 2},
            {name:"Energy", quantity: 2}],
        Production: [],
        ProductionPerSim: [{name:"PD", quantity: 65}, 
            {name:"Money", quantity: 2}],
        // which building and technology prerequisites exist before it can be built
        Prerequisites: {
            buildings: ["Town"], 
            tech: [] 
        },
        // if the building is inhabitable
        maxInhabitants: 250,
        // if the building is workable
        jobs: [{
            minEducation: 40,
            quantity: 25,
        },
        {
            minEducation: 60,
            quantity: 25,
        },
        {
            minEducation: 70,
            quantity: 1,
        }]
    },
    {
        name: "Megapolis",
        description: "Huge modern bustling settlement. Can only be built on plain terrain.",
        category: "Habitation",
        CAPEX: [],
        OPEX: [{name:"PD", quantity: 150}],
        OPEXPerSim: [{name:"PD", quantity: 2.5},
            {name:"Energy", quantity: 2.5}],
        Production: [],
        ProductionPerSim: [{name:"PD", quantity: 85}, 
            {name:"Money", quantity: 3}],
        // which building and technology prerequisites exist before it can be built
        Prerequisites: {
            buildings: ["City"], 
            tech: [] 
        },
        // if the building is inhabitable
        maxInhabitants: 500,
        // if the building is workable
        jobs: [{
            minEducation: 40,
            quantity: 50,
        },
        {
            minEducation: 60,
            quantity: 50,
        },
        {
            minEducation: 80,
            quantity: 1,
        }]
    },
    {
        name: "Futurepolis",
        description: "Futuristic settlement, the biggest you can get. Can only be built on plain terrain.",
        category: "Habitation",
        CAPEX: [],
        OPEX: [{name:"PD", quantity: 300}],
        OPEXPerSim: [{name:"PD", quantity: 3},
            {name:"Energy", quantity: 3}],
        Production: [],
        ProductionPerSim: [{name:"PD", quantity: 100}, 
            {name:"Money", quantity: 4}],
        // which building and technology prerequisites exist before it can be built
        Prerequisites: {
            buildings: ["Megapolis"], 
            tech: [] 
        },
        // if the building is inhabitable
        maxInhabitants: 1000,
        // if the building is workable
        jobs: [{
            minEducation: 40,
            quantity: 60,
        },
        {
            minEducation: 60,
            quantity: 100,
        },
        {
            minEducation: 80,
            quantity: 3,
        }]
    }
    
]