import {Meteor} from 'meteor/meteor'
import { AstroController, ColPlanetoids, ColStarsystems } from '.';
import { ColPlayer, ColShips } from '../Player';
import { RunningSystems } from '../RunningSystems'

const timeInterval = 100;
const updateInterval = 1000;

Meteor.publish("userData", function(){
    return [Meteor.users.find({_id: Meteor.userId()}, {
        fields: {playerId: 1}
    }), ColPlayer.find({_id: Meteor.user().playerId})]
})

Meteor.publish("galaxyById", function(gid){
    return ColStarsystems.find({galaxyId: gid})
})

Meteor.publish("systemById", function(id){
    const p = ColPlayer.findOne({_id: Meteor.user()?.playerId})
    if (!p) {
        throw new Meteor.Error("not-found", "no player information")
    }
    const ss = ColStarsystems.findOne({_id: id})
    if (!ss) {
        throw new Meteor.Error("not-found", "no star system with such id")
    }
    //const sso = AstroController.starSystemFromData(ss._id)
    //console.log(sso)
    return [
        ColStarsystems.find({_id: id}),
        ColPlanetoids.find({systemId: ss._id}),
        ColShips.find({systemId: ss._id})
    ]
})


Meteor.publish("systemByCurrentPlayer", function(){
    const p = ColPlayer.findOne({_id: Meteor.user()?.playerId})
    if (!p) {
        throw new Meteor.Error("not-found", "no player information")
    }
    const sh = ColShips.findOne({_id: p.currentShipId})
    if (!sh) {
        throw new Meteor.Error("not-found", "no current ship information")
    }
    const ss = ColStarsystems.findOne({_id: sh.systemId})
    if (!ss) {
        throw new Meteor.Error("not-found", "no star system with such id")
    }
    //const sso = AstroController.starSystemFromData(ss._id)
    //console.log(sso)
    return [
        ColStarsystems.find({_id: sh.systemId}),
        ColPlanetoids.find({systemId: ss._id}),
        ColShips.find({systemId: ss._id})
    ]
})
