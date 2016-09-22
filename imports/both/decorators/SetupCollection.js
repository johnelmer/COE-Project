import { Mongo } from 'meteor/mongo'

function SetupCollection(name) {
  return function setupCollection(target) {
    target.collection = new Mongo.Collection(name, {
      transform(doc) {
        return new target(doc)
      }
    })
  }
}
