import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

import _ from 'underscore'
import Model from './Model'

import SetupAccount from '../decorators/SetupAccount'

@SetupAccount()
class User extends Model {

  static login(username, password) {
    Meteor.loginWithPassword(username, password)
  }

  static logout() {
    return Meteor.logout()
  }

  getRole() {
    return this.profile.role
  }

  setRole(role) {
    if (role === 'Dean') {
      throw new Error('Not allowed!')
    }
    this.profile.role = role
  }

  changePassword(oldPassword, newPassword, callback) {
    Accounts.changePassword(oldPassword, newPassword, callback)
  }
}

export default User
