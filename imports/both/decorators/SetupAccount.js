/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
import { Meteor } from 'meteor/meteor'

function SetupAccount(target) {
  Meteor.users._transform = function (doc) {
    return new target(doc)
  }
  target.collection = Meteor.users
  target.collection.attachSchema(target.schema)
}

export default SetupAccount
