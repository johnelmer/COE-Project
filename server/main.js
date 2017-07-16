import { Accounts } from 'meteor/accounts-base'

import '/imports/server/permissions.js'
import '/imports/server/publications.js'
import '/imports/server/methods.js'

import User from '/imports/both/models/User'

Accounts.onCreateUser((options, user) => {
  user.profile = {}
  const roleName = options.roleName
  if (roleName !== 'Dean') {
    Object.assign(user, options)
  }
  else if (roleName === 'Dean' && User.find({ roleName: 'Dean' }).count() === 1) {
    user = {}
    throw new Error('Only 1 dean account allowed!')
  }
  return user
})

Accounts.config({
  forbidClientAccountCreation: true,
})
