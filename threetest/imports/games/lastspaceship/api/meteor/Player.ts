import Meteor from 'meteor/meteor'
import { Spaceship } from '../model/Spaceship'

export type Player = {
    name: string,
    _id?: string
}

declare module "meteor/meteor" {
    namespace Meteor {
        interface User {
            /**
             * Extending the User type
             */
            playerId: string
        }
    }
}

export const ColPlayer = new Mongo.Collection<Player>("players")
export const ColShips = new Mongo.Collection<Spaceship>("ships")