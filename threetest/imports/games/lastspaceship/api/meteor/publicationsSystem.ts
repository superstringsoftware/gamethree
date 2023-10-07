import {Meteor} from 'meteor/meteor'
import { ColPlayer, ColShips } from './Player';
import { RunningSystems } from './RunningSystems'

const timeInterval = 100;
const updateInterval = 1000;

Meteor.publish("userData", function(){
    return [Meteor.users.find({_id: Meteor.userId()}, {
        fields: {playerId: 1}
    }), ColPlayer.find({_id: Meteor.user().playerId})]
})

