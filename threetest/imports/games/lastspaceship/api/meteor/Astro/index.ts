import { IAstroBody, IGravityBody, IPlanetoidData, IStarSystemData } from "../../model/Astro/interfaces";
import {Mongo} from 'meteor/mongo'
import { Vector2g } from "../../model/Astro/Physics";
import { StarSystem } from "../../model/Astro/StarSystem";
import { AllHullTypes, IShipData } from "../../model/Ships/interfaces";
import { ColPlayer, ColShips } from "../Player";
import {Meteor} from 'meteor/meteor'
import { Stars } from "../../model/Astro/Stars";


export const ColStarsystems = new Mongo.Collection<IStarSystemData>("starsystems")
export const ColPlanetoids  = new Mongo.Collection<IPlanetoidData>("planetoids")

export const AstroController = {

    // generate and SAVE a new galaxy for a given player
    // including planets etc
    generateGalaxy: (nstars: number, dimx, dimy) => {
        if (!Meteor.userId()) throw new Meteor.Error("not-authorized", "can't create galaxy anonymously")
        const player = ColPlayer.findOne({_id:Meteor.user().playerId})
        if (!player) throw new Meteor.Error("not-authorized", "user doesnt have a player profile")
        const galId = player._id + "_" + Math.floor(Date.now() / 1000).toString()
        let gals = player.galaxies ? player.galaxies : []
        gals.push(galId)
        ColPlayer.update({_id:player._id}, {
            $set: {galaxies: gals, currentGalaxyId: galId}
        })
        // let's get to star generating
        for(let i = 0; i<nstars; i++) {
            let st = Stars.generateStar(dimx,dimy);
            st.galaxyId = galId
            st._id = ColStarsystems.insert(st)
            // now planets
            const pl = Stars.generateAllPlanetsForStar(st)
            pl.forEach(p=> {
                p.galaxyId = galId
                p.systemId = st._id
                ColPlanetoids.insert(p)
            })
        }
    },

    /**
     * Removes EVERYTHING, be very careful with this
     */
    removeGalaxy: (gid:string) => {
        if (!Meteor.userId()) throw new Meteor.Error("not-authorized", "can't create galaxy anonymously")
        const player = ColPlayer.findOne({_id:Meteor.user().playerId})
        if (!player) throw new Meteor.Error("not-authorized", "user doesnt have a player profile")
        if (!player.galaxies.find(g => g === gid)) {
            throw new Meteor.Error("not-authorized", "user doesnt own this galaxy")
        }
        const ng = player.galaxies.filter(e => e!==gid)
        const cg = (player.currentGalaxyId === gid) ? null : player.currentGalaxyId
        ColPlayer.update({_id:player._id}, {
            $set: {galaxies: ng, currentGalaxyId: cg}
        })
        ColStarsystems.remove({galaxyId: gid})
        ColPlanetoids.remove({galaxyId: gid})
        ColShips.remove({galaxyId: gid})

    },

    /**
     * Creates actual object from the data that's in the db
     */
    starSystemFromData: (id:string)=> {
        const st = ColStarsystems.findOne({_id:id})
        if (!st) return null
        const ss = new StarSystem(st)
        //console.log(ss)
        ss.star.coords = new Vector2g(0,0)
        ss.planetoids = ColPlanetoids.find({systemId: id}).map(p => p)
        ss.ships = ColShips.find({systemId: id}).map(p => p)
        // now, central bodies
        const f = (pl:IAstroBody[])=> {
            pl.forEach(p => {
                if (p.orbit) {
                    if(p.orbit.centerId === id) {
                        p.orbit.centerBody = ss.star
                    } else {
                        p.orbit.centerBody = ss.planetoids.find(p1 => p1._id === p.orbit.centerId) as IGravityBody
                    }
                }
            })
        }
        f(ss.planetoids)
        f(ss.ships)
        return ss
    }
}















/*
export const _createSolarSystem = () => {
    const s = ColStarsystems.findOne({name: "Sol"})
    if (s) {
        ColPlanetoids.remove({systemId: s._id})
        ColShips.remove({systemId: s._id})
        ColStarsystems.remove({_id:s._id})
    }
    let sol:IStarSystemData = {
        code: "S0000001",
        name: "Sol",
        description: "Our sun",
        mass: 2e30,
        radius: 696340000,
        visuals: {
            mainColor: "yellow",
            gradientStops: [0, "red", 0.7, "yellow", 1, "white"]
        }
    }
    StarSystem.verifyGravityBody(sol)
    sol._id = ColStarsystems.insert(sol)

    const mercury:IPlanetoidData = {
        systemId: sol._id,
        code: "S0000001-P01",
        name: "Mercury",
        description: "Closest planet to the Sun",
        type: "planet",
        mass: 3.285e23,
        radius: 2440000,
        visuals: {
            mainColor: "#591d04",
            gradientStops: [0, '#591d04', 0.8, '#624e3c', 1, '#f2d8ce']
        },
        orbit: StarSystem.calculateOrbitParams(
            sol,
            52000000000,
            -1.2,
            true
          )
    }
    StarSystem.verifyGravityBody(mercury)

    const venus:IPlanetoidData = {
        systemId: sol._id,
        code: "S0000001-P02",
        name: "Venus",
        description: "Our hot neighbor",
        type: "planet",
        mass: 4.86e24,
        radius: 6051000,
        visuals: {
            mainColor: "#cc780a",
            gradientStops: [0, '#cc780a', 0.8, '#935922', 1, '#fad4a2']
        },
        orbit: StarSystem.calculateOrbitParams(
            sol,
            108000000000,
            -2.7,
            true
          )
    }
    StarSystem.verifyGravityBody(venus)

    const earth:IPlanetoidData = {
        systemId: sol._id,
        code: "S0000001-P03",
        name: "Earth",
        description: "Home of humanity",
        type: "planet",
        mass: 5.972e24,
        radius: 6370000,
        visuals: {
            mainColor: "blue",
            gradientStops: [0, 'green', 0.8, '#336699', 1, '#3399ff']
        },
        orbit: StarSystem.calculateOrbitParams(
            sol,
            150000000000,
            0.8,
            true
          )
    }
    StarSystem.verifyGravityBody(earth)

    const mars:IPlanetoidData = {
        systemId: sol._id,
        code: "S0000001-P04",
        name: "Mars",
        description: "Our cold neighbor",
        type: "planet",
        mass: 0.64e24,
        radius: 3380000,
        visuals: {
            mainColor: "#8f2201",
            gradientStops: [0, '#8f2201', 0.8, '#ed5121', 1, '#fad4a2']
        },
        orbit: StarSystem.calculateOrbitParams(
            sol,
            239000000000,
            2.3,
            true
          )
    }
    StarSystem.verifyGravityBody(mars)

    mercury._id = ColPlanetoids.insert(mercury)
    venus._id = ColPlanetoids.insert(venus)
    earth._id = ColPlanetoids.insert(earth)
    mars._id = ColPlanetoids.insert(mars)

    const moon:IPlanetoidData = {
        systemId: sol._id,
        code: "S0000001-P03-M01",
        name: "The Moon",
        description: "Earth's only satellite",
        type: "moon",
        mass: 7.347e22,
        radius: 1730000,
        visuals: {
            mainColor: "gray",
            gradientStops: [0, 'green', 0.8, '#336699', 1, '#3399ff']
        },
        orbit: StarSystem.calculateOrbitParams(
            earth,
            384000000,
            1,
            true
          )
    }
    StarSystem.verifyGravityBody(moon)
    moon._id = ColPlanetoids.insert(moon)
    
    const sh1:IShipData = {
        systemId: sol._id,
        hd:AllHullTypes[0],
        transponder: "P-F342",
        transponderOn: true,
        name: "Christelle",
        description: "Standard police patrol ship",
        mass: 250000,
        orbit: StarSystem.calculateOrbitParams(
            earth,
            17249000,
            1,
            true
          )
    }
    const sh2:IShipData = {
        systemId: sol._id,
        hd:AllHullTypes[1],
        transponder: "M-F342",
        transponderOn: true,
        name: "Faster",
        description: "Military corvette",
        mass: 475000,
        orbit: StarSystem.calculateOrbitParams(
            earth,
            25549000,
            -0.4,
            false
          )
    }
    const sh3:IShipData = {
        systemId: sol._id,
        hd:AllHullTypes[3],
        transponder: "S-18",
        transponderOn: true,
        name: "Elephant",
        description: "Main docking station",
        mass: 1475000,
        orbit: StarSystem.calculateOrbitParams(
            earth,
            9549000,
            -0.9,
            false
          )
    }
    const sh:IShipData = {
        systemId: sol._id,
        ownerId: 'GTqdJauTfyCuttBiD',
        hd:AllHullTypes[2],
        transponder: "PL-001",
        transponderOn: true,
        name: "Rakhmaninoff",
        description: "The ship that started it all",
        mass: 150000,
        orbit: StarSystem.calculateOrbitParams(
            earth,
            39549000,
            2,
            false
          )
    }
    sh._id = ColShips.insert(sh)
    sh1._id = ColShips.insert(sh1)
    sh2._id = ColShips.insert(sh2)
    sh3._id = ColShips.insert(sh3)

    ColPlayer.update({_id: 'GTqdJauTfyCuttBiD'}, {$set: {
        currentShipId: sh._id
    }})

    
}
*/