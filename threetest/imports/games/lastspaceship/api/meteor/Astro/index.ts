import { IPlanetoidData, IStarSystemData } from "../../model/Astro/interfaces";
import {Mongo} from 'meteor/mongo'
import { Vector2g } from "../../model/Astro/Physics";
import { StarSystem } from "../../model/Astro/StarSystem";


export const ColStarsystems = new Mongo.Collection<IStarSystemData>("starsystems")
export const ColPlanetoids  = new Mongo.Collection<IPlanetoidData>("planetoids")

export const _createSolarSystem = () => {
    const s = ColStarsystems.findOne({name: "Sol"})
    if (s) {
        ColPlanetoids.remove({_id:{$in: s.planetoidIds}})
        ColStarsystems.remove({_id:s._id})
    }
    let sol:IStarSystemData = {
        code: "S0000001",
        name: "Sol",
        description: "Our sun",
        mass: 2e30,
        radius: 696340000,
        planetoidIds:[],
        shipIds:[]
    }
    StarSystem.verifyGravityBody(sol)
    sol._id = ColStarsystems.insert(sol)

    const mercury:IPlanetoidData = {
        code: "S0000001-P01",
        name: "Mercury",
        description: "Closest planet to the Sun",
        type: "planet",
        mass: 3.285e23,
        radius: 2440000,
        orbit: StarSystem.calculateOrbitParams(
            sol,
            52000000000,
            -1.2,
            true
          )
    }
    StarSystem.verifyGravityBody(mercury)

    const venus:IPlanetoidData = {
        code: "S0000001-P02",
        name: "Venus",
        description: "Our hot neighbor",
        type: "planet",
        mass: 4.86e24,
        radius: 6051000,
        orbit: StarSystem.calculateOrbitParams(
            sol,
            108000000000,
            -2.7,
            true
          )
    }
    StarSystem.verifyGravityBody(venus)

    const earth:IPlanetoidData = {
        code: "S0000001-P03",
        name: "Earth",
        description: "Home of humanity",
        type: "planet",
        mass: 5.972e24,
        radius: 6370000,
        orbit: StarSystem.calculateOrbitParams(
            sol,
            150000000000,
            0.8,
            true
          )
    }
    StarSystem.verifyGravityBody(earth)

    const mars:IPlanetoidData = {
        code: "S0000001-P04",
        name: "Mars",
        description: "Our cold neighbor",
        type: "planet",
        mass: 0.64e24,
        radius: 3380000,
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
        code: "S0000001-P03-M01",
        name: "The Moon",
        description: "Earth's only satellite",
        type: "moon",
        mass: 7.347e22,
        radius: 1730000,
        orbit: StarSystem.calculateOrbitParams(
            earth,
            384000000,
            1,
            true
          )
    }
    StarSystem.verifyGravityBody(moon)
    moon._id = ColPlanetoids.insert(moon)
    ColStarsystems.update({_id:sol._id}, {
        $set: {
            planetoidIds:[mercury._id, venus._id, earth._id, mars._id, moon._id ]
        }
    })
}
