import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import User from '/imports/both/models/User'

Meteor.methods({
  createNewUser: (doc, callback) => {
    const roleName = doc.roleName
    if (roleName !== 'dean') {
      Accounts.createUser(doc, callback)
    } else if (roleName === 'dean' && User.find({ roleName: 'Dean' }).count() === 0) {
      Accounts.createUser(doc, callback)
    } else {
      throw new Error('Not allowed!')
    }
  },

  changeUserPassword: (oldPassword, newPassword, callback) => {
    Accounts.changePassword(oldPassword, newPassword, callback)
  },

  /* TODO: refactor. Verify what kind of updates, role restrictions */
  updateUser: (doc, callback) => {
    User.update({ _id: doc._id }, { $set: doc }, {}, callback)
  },
})
