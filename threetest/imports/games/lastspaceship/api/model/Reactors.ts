export type Maybe<T> = { just: T } | "nothing"
export function mfmap<T>(f, x:Maybe<T>) {
    if (x === "nothing") return "nothing"
    else return { just: f(x.just)}
}

export type Resource = {
    name: string,
    quality?: number,
    // current state of the thingy - whether we need to fix it
    // 0 - 100
    state?: number, 
    quantity?: number,
    // in case our thingy is comprised of other thingies - here's their list
    compoundParts?: Resource[]
}

export interface ShipPart {

}

export type ReactorData = {
    name: string,
    description: string,
    size: number,
    fuelStorage: number, // kg
    fuelType: Resource[],
    minPower: number, // MW
    maxPower: number,
    mc2coef: number, // %
}

export class UraniumReactor implements ShipPart, Resource {
    name = "Uranium Reactor";
    reactorData: ReactorData;
    currentFuel: Resource; // how much and what type of U is in
    
    // subsystems that our reactor is made of
    // actual efficiency depends on them
    subsystems: {
        coolingSystem?: Resource
        reactorHull?: Resource
        computerControls?: Resource
        powerGenerator?: Resource
        controlRods?: Resource; // needed for control functions
    }

    constructor(rd:ReactorData) {
        this.reactorData = rd;
        this.currentFuel = {
            name: "Uranium",
            quantity: 0
        };
    }

    /**
     * Simulate operation in a given period of time
     * @param dt time in seconds
     * @param desP desired power at which to operate
     * @returns produced energy in MW
     */
    operate(dt:number, desP: number):number {
        if (desP>this.reactorData.maxPower) {
            throw new Error("Can't operate above maximum power")
        }
        if (desP<this.reactorData.minPower) {
            throw new Error("Can't operate below minimum power")
        }
        if (!this.subsystems.controlRods || this.subsystems.controlRods.state < 50) {
            throw new Error("Change control rods, current state is: " 
                + this.subsystems.controlRods.state)
        }
        // power fluctuation down and up with manual setting
        let fluct = [0.3, 0.2]
        // will be adjusted by computer controls quality and rods quality:
        if (this.subsystems.computerControls && (this.subsystems.computerControls.quality > 50)) {
            fluct[0] = fluct[0] / (this.subsystems.computerControls.quality - 50)
            fluct[1] = fluct[1] / (this.subsystems.computerControls.quality - 50)
        }
        const fl = 1 - fluct[0] + (fluct[1]-fluct[0])*Math.random()
        const pp = desP * fl * dt;

        

        return pp;
    }
}