import Meteor from 'meteor/meteor'
import { IShipData } from '../model/Ships/interfaces'


export type Player = {
    name: string,
    _id?: string,
    currentShipId?: string,
    ships?: string[]
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
export const ColShips = new Mongo.Collection<IShipData>("ships")