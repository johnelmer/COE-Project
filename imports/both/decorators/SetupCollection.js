/* eslint-disable no-param-reassign */

import { Mongo } from 'meteor/mongo'

function SetupCollection(collectionName) {
  return function setupCollection(target) {
    target.collection = new Mongo.Collection(collectionName, {
      transform(doc) {
        return new target(doc)
      },
    })
  }
}

export default SetupCollection
