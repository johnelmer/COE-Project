import { Accounts } from 'meteor/accounts-base'

import '/imports/server/permissions.js'
import '/imports/server/publications.js'
import '/imports/server/methods.js'

import User from '/imports/both/models/User'

Accounts.onCreateUser((options, user) => {
  user.profile = {}
  const roleName = options.profile.roleName
  const profileOptions = options.profile
  if (roleName !== 'Dean') {
    Object.keys(profileOptions).forEach((key) => {
      user[key] = profileOptions[key]
    })
  }
  else if (roleName === 'Dean' && User.find({ roleName: 'Dean' }).count() === 1) {
    user = {}
    throw new Error('Only 1 dean account allowed!')
  }
  return user
})
