import Model from './Model'
import { Accounts } from 'meteor/accounts-base'

class User extends Model{

  static find(selector, options){
    return Meteor.users.find(selector, options)
  }

  static find(selector, options){
    return Meteor.users.findOne(selector, options)
  }

  static insert(doc, callback){
    return Accounts.createUser(this.doc, callback)
  }

  static update(selector, modifier, options, callback){
    return Meteor.users.update(selector, modifier, options, callback)
  }

  static remove(selector, callback){
    return Meteor.users.remove(selector, callback)
  }

  static setUsername(userId, newUsername){
    return Accounts.setUsername(userId, newUsername)
  }

  static findUserByUsername(username){
    return Accounts.findUserByUsername(username)
  }

  static changePassword(oldPassword, newPassword, callback){//user must be logged in
    return Accounts.changePassword(oldPassword, newPassword, callback)
  } 

  static setPassword(userId, newPassword, options){
    return Accounts.setPassword(userId, newPassword, options)
  }

  save(callback){
    if(this._id){
      return Meteor.users.update(this._id, {$set: this.doc}, {}, callback)
    }
    else{
      return Accounts.createUser(this.doc, callback)
    }
  }
}