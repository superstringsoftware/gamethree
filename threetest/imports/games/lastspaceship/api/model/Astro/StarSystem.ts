/**
 * Star system is our main element in the game. It contains:
 * - central star
 * - planets with moons
 * - asteroids and other debri
 * - current ships
 *
 * The model is used in-game to simulate the actions, and it's being
 * created from the database with updates being recorded there as well.
 *
 * We will keep stars, planetoids, and ships in separate collections.
 *
 * All decart coordinates within star system are relative to the star
 */

import {
  IAstroBody,
  IAstroShip,
  IGravityBody,
  IOrbitParams,
  IPlanetoidData,
  IStarData,
} from "./interfaces";
import { Vector2g } from "./Physics";

export class StarSystem {
  static G = 6.67e-11;

  star: IStarData; // central star
  planetoids: IPlanetoidData[]; // ALL planetoids in the system with their own orbit data as needed
  ships: IAstroShip[]; // ALL ships in the system currently
  scale: number
  centerX: number
  centerY: number

  constructor(star:IStarData) {
    this.star = star
    this.planetoids=[]
    this.ships=[]
    this.scale = 1
  }

  calcScale(w:number, h:number) {
    let maxR = (this.planetoids.length > 0) ? this.planetoids[0].orbit.polar.x : this.star.radius * 1000
    for (let i = 1; i<this.planetoids.length; i++) {
      if (this.planetoids[i].orbit.polar.x > maxR) {
        maxR = this.planetoids[i].orbit.polar.x
      }
    }
    maxR = maxR *2
    this.scale = maxR / Math.min(w,h)
    this.centerX = w/2
    this.centerY = h/2
  }

  toScreenCoords(v:Vector2g) {
    //console.log("Calculating screen coords:")
    const res = new Vector2g(this.centerX + v.x/this.scale, 
      this.centerY - v.y/this.scale)
    //console.log(this)
    return res
  }

  getHabitableZoneBorder() {
    const hzStart = 7500000000*this.star.surfaceTemp / 400
    const hzEnd = 7500000000*this.star.surfaceTemp / 150
    return new Vector2g(hzStart, hzEnd)
  }
  

  /**
   * Advancing orbiting things only, no gravity simulations!
   * @param t
   */
  advanceOrbits(t: number) {
      const f = (pl:IAstroBody[]) => {
        pl.forEach((p) => {
            if (p.orbit) {
              p.orbit.polar.y += p.orbit.Omega * t;
            }
          });
      }
    f(this.planetoids)
    f(this.ships)
  }

  /**
   * Calculates decart coordinates for ALL objects relative to the
   * center object and the star
   */
  updateDecart() {
    const f = (pl: IAstroBody[]) => {
      // first, updating all decarts to local
      pl.forEach((p) => {
        if (p.orbit) {
          p.coords = Vector2g.FromPolar(p.orbit.polar)
          p.coordsStar = Vector2g.FromPolar(p.orbit.polar)
        }
      });
      pl.forEach((p) => {
        if (p.orbit) {
          // it's a planet
          //console.log(p.orbit.centerBody)
          p.coordsStar = Vector2g.Add(p.coordsStar, p.orbit.centerBody.coords);
          if (p.orbit.centerBody.orbit) {
            // it's a moon
            p.coordsStar = Vector2g.Add(
              p.coordsStar,
              p.orbit.centerBody.orbit.centerBody.coords
            );
            if (p.orbit.centerBody.orbit.centerBody.orbit) {
              // it's somemething around the moon
              p.coordsStar = Vector2g.Add(
                p.coordsStar,
                p.orbit.centerBody.orbit.centerBody.orbit.centerBody.coords
              );
            }
          }
        }
      });
    };
    f(this.planetoids)
    f(this.ships)
  }

  /**
   * Calculates handy values for the gravity body and returns it
   * @param b
   */
  static verifyGravityBody(b: IGravityBody): IGravityBody {
    b.GM = StarSystem.G * b.mass;
    b.gOnSurface = b.GM / b.radius / b.radius;
    return b;
  }

  /**
   * Creates orbit params from the center body and given radius
   * @param center
   * @param radius
   * @param angle
   * @param clockwise
   */
  static calculateOrbitParams(
    center: IGravityBody,
    radius: number,
    angle: number,
    clockwise: boolean
  ): IOrbitParams {
    const vorb = Math.sqrt(center.GM / radius);
    const om = vorb / radius;
    return {
      polar: new Vector2g(radius, angle),
      Vorb: vorb,
      Omega: clockwise ? om * -1 : om,
      //centerBody: center,
      centerId: center._id
    };
  }
}
