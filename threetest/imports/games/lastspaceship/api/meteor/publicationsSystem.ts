import {Meteor} from 'meteor/meteor'
import { ColAstrobodies, fromIAstroBodyData } from './AstroBodies'
import { ColPlayer, ColShips } from './Player';
import { RunningSystems } from './RunningSystems'

const timeInterval = 100;
const updateInterval = 1000;

Meteor.publish("userData", function(){
    return [Meteor.users.find({_id: Meteor.userId()}, {
        fields: {playerId: 1}
    }), ColPlayer.find({_id: Meteor.user().playerId})]
})

/**
 * This publishes a system based on the ship id:
 * so we lookup where this ship is located, then publish main info
 * on the system (planets), all ships that have transponders on
 */
Meteor.publish("systemByCurrentPlayer", function() {
    const p = ColPlayer.findOne({_id: Meteor.user().playerId})
    if (!p) {
        throw new Meteor.Error("not-found", "no player profile for the current user!")
    }
    const ship = ColShips.findOne({_id:p.currentShipId})
    if (!ship) {
        throw new Meteor.Error("not-found", "player has no current ship!")
    }
    let star = ColAstrobodies.findOne({_id:ship.parentId})
    if (star) {
        // we are inside the system
        if (star.parentId) {
            // not a star
            let tmp = ColAstrobodies.findOne({_id:star.parentId})
            star = tmp ? tmp : star
            if (tmp) {
                // again not a star, so was a moon
                tmp = ColAstrobodies.findOne({_id:tmp.parentId})
                star = tmp ? tmp : star
            }
        }
        const ids = star.allChildrenIds.map(x=>x)
        ids.push(star._id)
        // for now, only returning planets, moons and ships with transponder
        // once radar functionality is on - need to check for other stuff
        return [
            ColAstrobodies.find({_id:{$in: ids}, type: {$in: ["planet", "moon", "star"]} }),
            ColShips.find({_id: {$in: star.allShipIds}, transponderOn: true})
        ]
    }
    else {
        // we are not in the system so must be ftl between stars
        // TBD
        return []
    }

})

// this returns the whole system - an overkill
// ideally, we want to send only what the current user can sense!
// so, only planets (and possibly moons) +
// ships that transmit transponders
// + whatever radar can sense
Meteor.publish("systemById", function(sid) {
    console.log("Subscribing to ", sid)
    const star = ColAstrobodies.findOne({_id:sid})
    let cids = star.childrenIds.map(x=>x)
    cids.push(star._id)
    let sids = star.currentShipIds.map(x=>x)
    star.childrenIds.forEach(cid=> {
        const ob = ColAstrobodies.findOne({_id:cid})
        cids = cids.concat(ob.childrenIds)
        sids = sids.concat(ob.currentShipIds)
    })

    const starObj = fromIAstroBodyData(star)

    if (!RunningSystems[sid]) {
        RunningSystems[sid] = Meteor.setInterval(()=>{
            starObj.advanceOrbit(timeInterval)
            // now saving the new coordinates
            ColAstrobodies.update({_id:starObj._id}, {
                $set: {
                    orbit: starObj.orbit
                }
            })
            starObj.children.forEach( c => {
                //console.log("New angle: ", c.orbit.curAngle)
                ColAstrobodies.update({_id:c._id}, {
                    $set: {
                        orbit: c.orbit
                    }
                })
                c.children.forEach(c1 => {
                    ColAstrobodies.update({_id:c1._id}, {
                        $set: {
                            orbit: c1.orbit
                        }
                    })  
                })  
            })
        },updateInterval)
    }

    this.onStop(()=> {
        console.log("Stopping")
        Meteor.clearInterval(RunningSystems[sid])
        RunningSystems[sid] = null
    })

    return ColAstrobodies.find({_id: {$in: cids}})
})