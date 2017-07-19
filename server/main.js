import { Accounts } from 'meteor/accounts-base'

import '/imports/server/permissions.js'
import '/imports/server/publications.js'
import '/imports/server/methods.js'

import User from '/imports/both/models/User'

Accounts.onCreateUser((options, user) => {
  user.profile = {}
  Object.assign(user, options)
  return user
})

Accounts.config({
  forbidClientAccountCreation: true,
})
