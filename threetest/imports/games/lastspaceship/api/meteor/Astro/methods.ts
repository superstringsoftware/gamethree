import {Meteor} from 'meteor/meteor'
import { AstroController } from '.'

Meteor.methods({
    "galaxy.generate"(nstars: number, dimx: number, dimy: number) {
        AstroController.generateGalaxy(nstars,dimx,dimy)
    }
})