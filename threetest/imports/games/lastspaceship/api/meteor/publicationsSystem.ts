import {Meteor} from 'meteor/meteor'
import { ColAstrobodies, fromIAstroBodyData } from './AstroBodies'
import { RunningSystems } from './RunningSystems'

const timeInterval = 100;
const updateInterval = 1000;

Meteor.publish("systemById", function(sid) {
    console.log("Subscribing to ", sid)
    const star = ColAstrobodies.findOne({_id:sid})
    let cids = star.childrenIds.map(x=>x)
    cids.push(star._id)

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