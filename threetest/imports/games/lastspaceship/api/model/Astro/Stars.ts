import { IPlanetoidData, IStarData } from "./interfaces"
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
    earthR: 6370000,
    earthM: 5.972e24,

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
                galacticCoords: new Vector2g(10+Math.random()*(dimx-20), 10+Math.random()*(dimy-20)),
                spectralColor: sc.color,
                radius: (sc.minR + Math.random()*(sc.maxR-sc.minR))*Stars.solarR,
                mass: (sc.minM + Math.random()*(sc.maxM-sc.minM))*Stars.solarM,
                name: "S000" + Math.round(10000*Math.random()).toString(),
                code: "S000" + Math.round(10000*Math.random()).toString(),
                description: ""
            }
            StarSystem.verifyGravityBody(st)
            return st
        }
        else throw new Error("Failed to get spectral class")
        
    },

    generateAllPlanetsForStar(st:IStarData) {
        // habitable zone
        const hzStart = 7500000*st.surfaceTemp / 400
        const hzEnd = 7500000*st.surfaceTemp / 150
        let numOfPlanets = Math.floor(5*Math.random())
        if (Math.random()>0.85) numOfPlanets+= 1
        if (Math.random()>0.95) numOfPlanets+= 1
        let nHabit = Math.floor(1 + 0.7*Math.random()*numOfPlanets)
        
        if (numOfPlanets === 0) nHabit = 0
        const nInner = Math.floor((numOfPlanets - nHabit)/2)
        const nOuter = numOfPlanets - nHabit - nInner
        console.log("Total number of planets / inner / habitable zone / outer: ", 
            numOfPlanets, nInner, nHabit, nOuter) 
        
        // inner
        let d = st.radius*5 + Math.random()*(hzStart-st.radius*5)/nInner
        let np = 1
        let planets = []
        for (let i = 0; i<nInner; i++) {
            const p = Stars.generatePlanetForStar(st,
                d, {
                    atmo: [0.4, 0.75, 0.9],
                    planetNum: np
                })
                d+=Math.random()*(hzStart-st.radius*5)/nInner
                np++
                planets.push(p)
            //console.log(p)
        }
        // habitable zone
        d = hzStart+Math.random()*(hzEnd-hzStart)/nHabit
        for (let i = 0; i<nHabit; i++) {
            const p = Stars.generatePlanetForStar(st,
                d, {
                    atmo: [0.2, 0.5, 0.8],
                    planetNum: np
                })
                np++
                d+=Math.random()*(hzEnd-hzStart)/nHabit
                planets.push(p)
            //console.log(p)
        }
        // outer
        d = hzEnd + Math.random()*hzEnd
        for (let i = 0; i<nOuter; i++) {
            const p = Stars.generatePlanetForStar(st,
                d, {
                    atmo: [0.7, 0.9, 0.98],
                    planetNum: np
                })
                np++
                d+=Math.random()*hzEnd
                planets.push(p)
            //console.log(p)
        }
        return planets
    },

    generatePlanetForStar:(st:IStarData, distance:number, profile: {
        atmo: number[], // thresholds for atmosphere
        planetNum: number
    })=>{
        const temp = 7500000*st.surfaceTemp/distance
        // gas giant or not
        const r = (Math.random() < 0.25) ? 40000000 + Math.random()*50000000 
            : 1500000 + Math.random()*10000000
        let atmo : "toxic" | "breathable" | "earth" | "abundant" = "toxic"
        const atmoR = Math.random()
        if (atmoR > profile.atmo[0]) atmo = "breathable"
        if (atmoR > profile.atmo[1]) atmo = "earth"
        if (atmoR > profile.atmo[2]) atmo = "abundant"
        const t1 = Math.random()
        const t2 = Math.random()
        const t3 = Math.random()
        const t4 = Math.random()
        const tsum = t1 + t2 + t3 + t4
        const m = (r/Stars.earthR)*Stars.earthM*(0.75+0.5*Math.random())
        //console.log("mass: ", m, r/Stars.earthR)
        let pd:IPlanetoidData = {
            radius: r,
            mass: m,
            type: "planet",
            atmosphere: atmo,
            atmoPressure: Math.random()*2*(1+ Math.exp(Math.random()/0.95)),
            soilSimple: Math.random()*100,
            terrain: {
                mountains: t1/tsum,
                hills: t2/tsum,
                plains: t3/tsum,
                oceans: t4/tsum
            },
            minT: temp*(1-0.6*Math.random()),
            maxT: temp*(1+0.5*Math.random()),
            code: st.code + "-P0" + profile.planetNum.toString(),
            name: st.code + "-P0" + profile.planetNum.toString(),
            description: "",
            orbit: StarSystem.calculateOrbitParams(st,
                distance,
                Math.random()*Math.PI*2,
                (Math.random()<0.2)? true : false)
        }
        StarSystem.verifyGravityBody(pd)
        return pd;
    }
}