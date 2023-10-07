import { IAstroShip } from "../Astro/interfaces";

export interface IResource {
    name: string,
    quality?: number,
    // current state of the thingy - whether we need to fix it
    // 0 - 100
    state?: number, 
    quantity?: number,
    // in case our thingy is comprised of other thingies - here's their list
    compoundParts?: IResource[]
}

export interface IHullData {
    name: string,
    description: string,
    size: number,
    sectors: number,
    materials: IResource[],
    dryMass: number,
    pictures?: {
        normal?: string,
        icon?: string,
        edges?: string, // quick and dirty way to make edges:
        // Gimp - Edge-Detect - Image Gradient
        // then transparency
        // then hue to get greenish color
    }
}

export interface IShipData extends IAstroShip {
    ownerId?: string;

    // main data
    hd: IHullData;
    transponder: string;
    transponderOn: boolean;
    name: string;
    description: string;

    // if in flight:
    originId?: string; // astro body id
    destinationId?: string; // astro body id
    dockedWithId?: string; // if docked - id of the ship that docked with

    // components
    //reactors: BaseReactor[];
    //sublightDrives: SublightDrive[];
    //ftlDrives: FTLDrive[];
    //computer?: ShipComputer;
    //weapons, armor, hullAUX, internalAUX
}


export const AllHullTypes : IHullData[] = [
    {
        name: "Falcon",
        description: "Reliable, albeit a bit dated, all-rounder",
        size: 1,
        sectors: 6,
        materials: [{name:"Titanium"}],
        dryMass: 100000,
        pictures: {
            normal: "/lastspaceship/ships/falcon01.png",
            edges: "/lastspaceship/ships/falcon01edges.png"
        }
    },
    {
        name: "Sparrow",
        description: "Lightest nimblest starter ship",
        size: 1,
        sectors: 5,
        materials: [{name:"Titanium"}],
        dryMass: 55000,
        pictures: {
            normal: "/lastspaceship/ships/sparrow01.png",
            edges: "/lastspaceship/ships/sparrow01edges.png"
        }
    },
    {
        name: "Ladybug",
        description: "Heavier and bigger than other small ships, good for cargo hauling",
        size: 1,
        sectors: 8,
        materials: [{name:"Titanium"}],
        dryMass: 135000,
        pictures: {
            normal: "/lastspaceship/ships/ladybug01.png",
            edges: "/lastspaceship/ships/ladybug01edges.png"
        }
    },
    {
        name: "Station1",
        description: "Orbiting station around the planets, med size",
        size: 3,
        sectors: 20,
        materials: [{name:"Titanium"}],
        dryMass: 500000,
        pictures: {
            normal: "/lastspaceship/ships/ladybug01.png",
            edges: "/lastspaceship/ships/ladybug01edges.png"
        }
    },
]