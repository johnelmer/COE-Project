import { Meteor } from 'meteor/meteor'

function SetupAccount(target) {
  Meteor.users._transform = function(doc) {
    return new target(doc)
  }
}

export default SetupAccount
