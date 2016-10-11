/* eslint-disable no-param-reassign */
import { Meteor } from 'meteor/meteor'

function SetupAccount(schema) {
  return function setupAccount(target) {
    Meteor.users._transform = function (doc) {
      return new target(doc)
    }
    target.collection = Meteor.users
    // schema code here
  }
}

export default SetupAccount
