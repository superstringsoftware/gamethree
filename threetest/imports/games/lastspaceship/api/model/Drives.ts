/**
 * Drives are of 2 types - sublight and FTL.
 * Sublight in turn are:
 *  - jet (the usual)
 *  - antigrav
 *  - quantum foam surfing (TBD)
 * 
 * Sublight drives are operated in 2 modes:
 *  - set force ("constant acceleration" mode)
 *  - strategic, where we simply calculate all consumptions when
 * a player gives command to change orbits, fly from here to there etc
 * 
 * Ok so after modeling, jet engines behave quite interestingly:
 * 1) if we maximize Vex and minimize mu - we get lower acceleration,
 * but much higher delta-V (since our fuel is enough for much longer)
 * 2) if we maximize mu - we get maximum accel, but the lifetime is
 * much much shorter
 * 
 * So it follows that we should in normal operation maximize Vex,
 * while for manuevering for very short times (battles mostly) - 
 * maximize mu.
 * 
 * Ok different calculation:
 * we produced E = P*t energy for some time t
 * we use this energy to accelerate some mass m of fuel:
 * E = mv2/2, v = sqrt(2Pt/m)
 * Now we *independently* use this accelerated mass as propellant!
 * During time t', this means mu = m/t', 
 * F = mu*v = m*sqrt(2Pt/m)/t'
 * So the longer t' the smaller force, but
 * V = at = F/M*t' = m*sqrt(2Pt/m)/M
 * So dV depends only on total fuel mass spent and the time we
 * take to accelerate it, not on how fast we spend it
 * 
 * Ok so via energy - 
 * MV2/2 = mv2/2
 * so V = sqrt(m/M)*v
 */

import { Resource, ShipPart } from "./Resources";

export type JetDriveData = {
    name: string,
    description: string,
    size: number,
    fuelStorage: number, // kg
    fuelType: Resource[],
    // m/s - min and max velocity of exhaust 
    massPerSec: number, // maximum fuel mass spend per second,
    Vex: number, // maximum exhaust velocity
    efficiency: number, // 0..1 conversion from power gen to energy of the jet
}

export abstract class SublightDrive implements ShipPart, Resource {
    name = "Sublight Drive";

    constructor() {
    }

    /**
     * Operate at a given power
     * @param pow power given
     * @param dt time passed in s
     * @returns thrust in newton
     * Inside, this function should take care of the fuel spent etc
     */
    abstract operateAtPower(pow:number,dt:number):number;

    /**
     * Another variant of the operation - at constant thrust.
     * @returns power needed to support such thrust
     * @param thrust thrust that we want to achieve
     */
    abstract operateAtThrust(thrust:number):number;
}

export class JetDrive extends SublightDrive {
    jetDriveData:JetDriveData;
    currentFuel: Resource;
    constructor(jd:JetDriveData) {
        super()
        this.jetDriveData = jd;
        this.currentFuel = {
            name: "Water",
            quantity: 0
        }
    }

    operateAtPower(pow:number,dt:number):number {
        
        this.currentFuel.quantity -= this.jetDriveData.massPerSec * dt
        if (this.currentFuel.quantity < 0) {
            this.currentFuel.quantity = 0
            throw new Error("Out of fuel!")
        }
        const thrust = this.jetDriveData.massPerSec * Math.sqrt(2*pow*this.jetDriveData.efficiency/this.jetDriveData.massPerSec)
        return thrust
    }

    operateAtThrust(thrust:number):number {
        const power = thrust * thrust / 2 / this.jetDriveData.massPerSec / this.jetDriveData.efficiency
        return power
    }
}

export class FTLDrive implements ShipPart, Resource {
    name = "FTL Drive"
}

export const AllJetDrivesTypes : JetDriveData[] = [
    {
        name: "Johnson FM-319",
        description: "Basic reliable jet drive",
        size: 1,
        fuelStorage: 50000, // kg
        fuelType: [{name: "Water"}],
        massPerSec: 20, // maximum fuel mass spend per second,
        Vex: 1000000, // maximum exhaust speed 
        efficiency: 0.65, // 0..1 conversion from power gen to energy of the jet
    }
]