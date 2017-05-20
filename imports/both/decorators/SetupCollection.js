/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */

import { Mongo } from 'meteor/mongo'

function SetupCollection(collectionName) {
  return function setupCollection(target) {
    target.collection = new Mongo.Collection(collectionName, {
      transform(doc) {
        return new target(doc)
      },
    })
    target.collection.attachSchema(target.schema)
  }
}

export default SetupCollection
