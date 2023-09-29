import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson'


Meteor.startup(async () => {
  
  const data = Assets.getText("gamedata/simtower/pocbuildings.json")
  //console.log(data)
  const objData = EJSON.parse(data)
  console.log(objData)

  
});
