/* eslint-disable no-param-reassign */

import { Mongo } from 'meteor/mongo'

function SetupCollection(collectionName) {
  return function setupCollection(Target) {
    Target.collection = new Mongo.Collection(collectionName, {
      transform: doc => new Target(doc),
    })
  }
}

export default SetupCollection
