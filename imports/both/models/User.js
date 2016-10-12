import Model from './Model'
import { Accounts } from 'meteor/accounts-base'
import SetupAccount from '../decorators/SetupAccount'

@SetupAccount
class User extends Model {
  
  save(callback) {
    if(this._id) {
      return Meteor.users.update(this._id, {$set: this.doc}, {}, callback)
    }
    else {
      return Accounts.createUser(this.doc, callback)
    }
  }
}