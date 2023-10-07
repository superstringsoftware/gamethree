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

  /**
   * Advancing orbiting things only, no gravity simulations!
   * @param t
   */
  advanceOrbits(t: number) {
    this.planetoids.forEach((p) => {
      if (p.orbit) {
        p.orbit.polar.y += p.orbit.Omega * t;
      }
    });
    this.ships.forEach((p) => {
      if (p.orbit) {
        p.orbit.polar.y += p.orbit.Omega * t;
      }
    });
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
          p.coords = p.orbit.polar.FromPolar();
          p.coordsStar = p.orbit.polar.FromPolar();
        }
      });
      pl.forEach((p) => {
        if (p.orbit) {
          // it's a planet
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
      centerBody: center,
    };
  }
}
