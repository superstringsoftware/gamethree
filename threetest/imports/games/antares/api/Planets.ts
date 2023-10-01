import { IBuilding } from "./Buildings";

export type TTerrain =
  | "mountains"
  | "high mountains"
  | "high hills"
  | "hills"
  | "flats"
  | "shallow"
  | "deep";

export interface IClimate {
  minTemp: number;
  aveTemp: number;
  maxTemp: number;
  minWind: number;
  aveWind: number;
  maxWind: number;
  sunDays: number; // percentage
  humidity: number;
  precipitation: number;
}

export type TClimate = IClimate 
    | "very cold" 
    | "cold"
    | "cool"
    | "normal"
    | "warm"
    | "hot"
    | "very hot"

export interface IPlanetSector {
  surfaceResources: { name: string; quantity: number; quality: number }[];
  groundResources: {
    name: string;
    quantity: number;
    quality: number;
    depth: number;
  }[];
  terrain: TTerrain;
  climate: TClimate;
  buildings?: IBuilding[];
}

export interface IPlanet {
    name: string,
    description: string,
    sectors: IPlanetSector[][]
}


export const TestPlanet : IPlanet = {
  name: "Test Planet",
  description: "Planet for testing basic functionality",
  sectors: [
    [
      {
        terrain: "flats",
        climate: "warm",
        surfaceResources: [
          {name: "Rivers", quantity: 37, quality: 100},
          {name: "Wheat", quantity: 100, quality: 78}
        ],
        groundResources: []
      },
      {
        terrain: "hills",
        climate: "normal",
        surfaceResources: [
          {name: "Flora", quantity: 30, quality: 40}
        ],
        groundResources: []
      },
      {
        terrain: "flats",
        climate: "normal",
        surfaceResources: [
          {name: "Flora", quantity: 30, quality: 40}
        ],
        groundResources: []
      },
      {
        terrain: "high hills",
        climate: "cool",
        surfaceResources: [
          {name: "Flora", quantity: 20, quality: 30}
        ],
        groundResources: [
          {name: "Titanium", quantity: 12000, quality: 77, depth: 0}
        ]
      }
    ],
    [
      {
        terrain: "shallow",
        climate: "warm",
        surfaceResources: [
          {name: "Ocean", quantity: 50, quality: 100},
          {name: "Oysters", quantity: 100, quality: 78}
        ],
        groundResources: []
      },
      {
        terrain: "mountains",
        climate: "cool",
        surfaceResources: [
          {name: "Flora", quantity: 20, quality: 40}
        ],
        groundResources: [
          {name: "Aluminum", quantity: 15000, quality: 77, depth: 0}
        ]
      },
      {
        terrain: "high mountains",
        climate: "cold",
        surfaceResources: [],
        groundResources: []
      },
      {
        terrain: "high hills",
        climate: "cool",
        surfaceResources: [
          {name: "Flora", quantity: 33, quality: 15},
          {name: "Cows", quantity: 74, quality: 85}
        ],
        groundResources: []
      }
    ]
  ]
}
