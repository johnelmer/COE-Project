/* eslint-disable no-param-reassign */
import { Meteor } from 'meteor/meteor'

function SetupAccount(target) {
  target.collection = Meteor.users
}

export default SetupAccount
