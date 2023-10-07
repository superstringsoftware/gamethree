import { IStarData } from "./interfaces"
import { Vector2g } from "./Physics"
import { StarSystem } from "./StarSystem"

export const StellarClasses = [
    {
        name: "M",
        minT: 2400,
        maxT: 3700,
        minM: 0.08, // in solar masses
        maxM: 0.45,
        minR: 0.01, // in solar radii
        maxR: 0.7,
        realPrevalence: 0.76,
        genThreshold: 0.0, // shifting probability percentages a bit
        color: "#ffcc6f"
    },
    {
        name: "K",
        minT: 3700,
        maxT: 5200,
        minM: 0.45, // in solar masses
        maxM: 0.8,
        minR: 0.7, // in solar radii
        maxR: 0.96,
        realPrevalence: 0.12,
        genThreshold: 0.4, // shifting probability percentages a bit
        color: "#ffd2a1"
    },
    {
        name: "G",
        minT: 5200,
        maxT: 6000,
        minM: 0.8, // in solar masses
        maxM: 1.04,
        minR: 0.96, // in solar radii
        maxR: 1.15,
        realPrevalence: 0.076,
        genThreshold: 0.8, // shifting probability percentages a bit
        color: "#fff4ea"
    },
    {
        name: "F",
        minT: 6000,
        maxT: 7500,
        minM: 1.04, // in solar masses
        maxM: 1.4,
        minR: 1.15, // in solar radii
        maxR: 1.4,
        realPrevalence: 0.03,
        genThreshold: 0.92, // shifting probability percentages a bit
        color: "#f8f7ff"
    },
    {
        name: "A",
        minT: 7500,
        maxT: 10000,
        minM: 1.4, // in solar masses
        maxM: 2.1,
        minR: 1.4, // in solar radii
        maxR: 1.8,
        realPrevalence: 0.0061,
        genThreshold: 0.95, // shifting probability percentages a bit
        color: "#cad8ff"
    },
    {
        name: "B",
        minT: 10000,
        maxT: 30000,
        minM: 2.1, // in solar masses
        maxM: 16,
        minR: 1.8, // in solar radii
        maxR: 6.6,
        realPrevalence: 0.0012,
        genThreshold: 0.98, // shifting probability percentages a bit
        color: "#a9bfff"
    },
    {
        name: "O",
        minT: 30000,
        maxT: 100000,
        minM: 16, // in solar masses
        maxM: 150,
        minR: 6.6, // in solar radii
        maxR: 20,
        realPrevalence: 0.0000003,
        genThreshold: 0.995, // shifting probability percentages a bit
        color: "#9bafff"
    },
]

export const Stars = {
    solarM: 2e30,
    solarR: 696340000,

    // generate random star
    generateStar: (dimx:number, dimy:number) => {
        const r = Math.random()
        let sc = StellarClasses[0]
        //StellarClasses.forEach(s => { if (r < s.genThreshold) sc = s })
        for (let i = StellarClasses.length -1; i>0; i--) {
            if (r > StellarClasses[i].genThreshold) {
                sc = StellarClasses[i]
                break;
            }
        }
        if (sc) {
            let st : IStarData = {
                starClass: sc.name,
                surfaceTemp: sc.minT + Math.random()*(sc.maxT-sc.minT),
                galacticCoords: new Vector2g(Math.random()*dimx, Math.random()*dimy),
                spectralColor: sc.color,
                radius: (sc.minR + Math.random()*(sc.maxR-sc.minR))*Stars.solarR,
                mass: (sc.minM + Math.random()*(sc.maxM-sc.minM))*Stars.solarM,
                name: "S000" + Math.round(10000*Math.random()).toString(),
                description: ""
            }
            StarSystem.verifyGravityBody(st)
            return st
        }
        else throw new Error("Failed to get spectral class")
        
    }
}