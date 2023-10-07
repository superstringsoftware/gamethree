import { Meteor } from "meteor/meteor";
import { ColPlayer, ColShips } from "/imports/games/lastspaceship/api/meteor/Player";

import "/imports/games/simtower/api/publications";

import "/imports/meterm/TerminalSrv";

import "/imports/games/lastspaceship/api/meteor/publicationsSystem"
import { _createSolarSystem } from "/imports/games/lastspaceship/api/meteor/Astro";

Meteor.startup(async () => {
  const us = Meteor.users.find({ playerId: { $exists: false } });
  us.forEach((u) => {
    const id = ColPlayer.insert({ name: u.username });
    Meteor.users.update({ _id: u._id }, { $set: { playerId: id } });
  });

  //setupSolar()
  _createSolarSystem()
});

