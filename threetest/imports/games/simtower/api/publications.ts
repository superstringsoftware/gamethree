import {EJSON} from 'meteor/ejson'

const data = Assets.getText("gamedata/simtower/pocbuildings.json")
//console.log(data)
const objData = EJSON.parse(data)
console.log(objData)

Meteor.publish("allBuildings", function() {
    let _self = this
    //@ts-ignore
    objData.forEach((b,i) => {
        _self.added("allAvailableBuildings",i.toString(),b)
    })
    this.ready()
})