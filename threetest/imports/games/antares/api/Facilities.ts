// https://docs.google.com/spreadsheets/d/1V0ygoOzjEA_XTqSV4fD0C3f_RUdqYshmZxpgZBYElkQ/edit#gid=0

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
    // if the building is workable
    jobs: IJobRequirements[],
    // FUNCTIONS
    produce?: ()=>Array<{name:string, quantity: number}>
}

/**
 * Let's make core buildings hardcoded
 */

export const AllBuildings:IBaseBuilding[] = [
    {
        name: "Colony",
        description: "",
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
        inhabitants: {
            maxNumber: 10,
            current: []
        },
        // if the building is workable
        jobs: [{
            minEducation: 40,
            quantity: 2,
        }]
    },
    {
        name: "Village",
        description: "",
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
        inhabitants: {
            maxNumber: 25,
            current: []
        },
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
        description: "",
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
        inhabitants: {
            maxNumber: 100,
            current: []
        },
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
        description: "",
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
        inhabitants: {
            maxNumber: 250,
            current: []
        },
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
        description: "",
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
        inhabitants: {
            maxNumber: 500,
            current: []
        },
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
        description: "",
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
        inhabitants: {
            maxNumber: 1000,
            current: []
        },
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