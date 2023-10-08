import {Meteor} from 'meteor/meteor'
import { AstroController } from '.'

Meteor.methods({
    "galaxy.generate"(nstars: number, dimx: number, dimy: number) {
        AstroController.generateGalaxy(nstars,dimx,dimy)
    },
    "galaxy.remove"(id:string) {
        AstroController.removeGalaxy(id)
    }
})