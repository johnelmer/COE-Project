/* eslint-disable no-param-reassign */
import { Meteor } from 'meteor/meteor'

function SetupAccount(schema) {
  return function setupAccount(Target) {
    Meteor.users._transform = function (doc) {
      return new Target(doc)
    }
    Target.collection = Meteor.users
    // schema code here
  }
}

export default SetupAccount
