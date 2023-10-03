/**
 * Survival / Trading / Exploration in space with focus on radar gameplay inspired by "the last battleship"
 * 
 * The idea is - have a spaceship, moving from system to system,
 * tactical map is all based on various radar - active / passive / transponders etc.
 * 
 * Then combat / trading / missions.
 * 
 * Upgrade of the systems etc as usual.
 * 
 * TYPES OF DAMAGE
 * 
 * - Breaking molecular bonds:
 *      - Mechanical / Kinetic
 *      - Photons (lasers)
 *      - Electrically charged particles (up to certain energies?)
 * 
 * - Breaking atoms apart - so not just molecular bonds, but kicking electrons away from nuclei. Basically, as previous but higher energies.
 * 
 * - Breaking nuclei apart - nuclear fission:
 *      - ECP beams of very high energies
 *      - Neutron beams (how do we generate?)
 *      - Can very energetic gamma photons do this?
 * 
 * - Breaking apart protons and neutrons - strong force:
 *      - Quark-gluon plasma beams - cuts through any matter just like that, huge energies. Any protection?? Some custom Quark configurations to interact with these beams??
 * 
 * - Gravity: space curving
 * 
 * - Higgs bozon beams: changing masses of particles with some crazy results
 */

import { ShipComputer } from "./Computers";
import { FTLDrive, SublightDrive } from "./Drives";
import { BaseReactor } from "./Reactors";

export class Spaceship {

    reactors: BaseReactor[];
    sublightDrives: SublightDrive[];
    ftlDrives: FTLDrive[];
    computer?: ShipComputer;
    //weapons, armor, hullAUX, internalAUX

}