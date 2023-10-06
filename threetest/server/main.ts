import { Meteor } from "meteor/meteor";
import { ColAstrobodies } from "/imports/games/lastspaceship/api/meteor/AstroBodies";
import { ColPlayer, ColShips } from "/imports/games/lastspaceship/api/meteor/Player";
import {
  AllHullTypes,
  Spaceship,
} from "/imports/games/lastspaceship/api/model/Spaceship";

import "/imports/games/simtower/api/publications";

import "/imports/meterm/TerminalSrv";

import "/imports/games/lastspaceship/api/meteor/publicationsSystem"

Meteor.startup(async () => {
  const us = Meteor.users.find({ playerId: { $exists: false } });
  us.forEach((u) => {
    const id = ColPlayer.insert({ name: u.username });
    Meteor.users.update({ _id: u._id }, { $set: { playerId: id } });
  });

  //setupSolar()
});

const setupSolar = () => {
  // careful - it KILLS everything first!!!
  ColAstrobodies.remove({});
  ColShips.remove({});
  // setting up solar system in case it doesnt exist
  const sid = ColAstrobodies.insert({
    code: "S0000001",
    name: "Sol",
    description: "Humanity's home star",
    type: "star",
    // decart coordinates in the galaxy, for STARS and their level objects only
    galX: -10000,
    galY: -10000,
    mass: 2e30,
    radius: 696340000,
    childrenIds: [], // if has children orbiting bodies - them
    currentShipIds: [], // current ships either in orbit or free movement
  });
  const mid = ColAstrobodies.insert({
    code: "S0000001-P01",
    name: "Mercury",
    description: "Closest planet to the Sun",
    type: "planet",
    parentId: sid,
    mass: 3.285e23,
    radius: 2440000,
    orbit: {
      radius: 52000000000,
      curAngle: -1.2,
    },
    childrenIds: [], // if has children orbiting bodies - them
    currentShipIds: [], // current ships either in orbit or free movement
  });
  const vid = ColAstrobodies.insert({
    code: "S0000001-P02",
    name: "Venus",
    description: "Our neighbor",
    type: "planet",
    parentId: sid,
    mass: 4.86e24,
    radius: 6051000,
    orbit: {
      radius: 108000000000,
      curAngle: -2.7,
    },
    childrenIds: [], // if has children orbiting bodies - them
    currentShipIds: [], // current ships either in orbit or free movement
  });
  const eid = ColAstrobodies.insert({
    code: "S0000001-P03",
    name: "Earth",
    description: "Our home",
    type: "planet",
    parentId: sid,
    mass: 5.972e24,
    radius: 6370000,
    orbit: {
      radius: 150000000000,
      curAngle: 1.1,
    },
    childrenIds: [], // if has children orbiting bodies - them
    currentShipIds: [], // current ships either in orbit or free movement
  });
  const mnid = ColAstrobodies.insert({
    code: "S0000001-P03-M01",
    name: "The Moon",
    description: "the only Earth's satellite",
    type: "moon",
    parentId: eid,
    mass: 7.347e22,
    radius: 1730000,
    orbit: {
      radius: 384000000,
      curAngle: 1.1,
    },
    childrenIds: [], // if has children orbiting bodies - them
    currentShipIds: [], // current ships either in orbit or free movement
  });
  // adding moon to earth
  ColAstrobodies.update(
    { _id: eid },
    {
      $set: {
        childrenIds: [mnid],
      },
    }
  );
  const mrid = ColAstrobodies.insert({
    code: "S0000001-P04",
    name: "Mars",
    description: "Our other neighbor",
    type: "planet",
    parentId: sid,
    mass: 0.64e24,
    radius: 3380000,
    orbit: {
      radius: 239000000000,
      curAngle: 2.9,
    },
    childrenIds: [], // if has children orbiting bodies - them
    currentShipIds: [], // current ships either in orbit or free movement
  });
  // adding planets to sun
  ColAstrobodies.update(
    { _id: sid },
    {
      $set: {
        childrenIds: [mid, vid, eid, mrid],
      },
    }
  );

  // ships
  var _station1 = new Spaceship({
    hullData: AllHullTypes[3],
    transponder: "M-F41",
    shipName: "Nicole",
    description: "Battlestar orbiting the planet for base protection",
    
  });
  _station1.orbit = {
    radius: 7370000,
    curAngle: 0.1
}
_station1.parentId = eid

  var _station2 = new Spaceship({
    hullData: AllHullTypes[2],
    transponder: "M-OF317",
    shipName: "Jo-4",
    description: "Communications satellite for the military",
  });
  _station2.orbit = {
    radius: 16400000,
    curAngle: 0.3
}
_station2.parentId = eid

  var _station3 = new Spaceship({
    hullData: AllHullTypes[0],
    transponder: "P-219",
    shipName: "Merger",
    description: "Police patrol ship",
  });
  _station3.orbit = {
    radius: 9520000,
    curAngle: -0.25
}
_station3.parentId = eid

const s1 = ColShips.insert(_station1)
const s2 = ColShips.insert(_station2)
const s3 = ColShips.insert(_station3)

ColAstrobodies.update(
    { _id: eid },
    {
      $set: {
        currentShipIds: [s1,s2,s3],
      },
    }
  );
};
