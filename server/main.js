import { Accounts } from 'meteor/accounts-base'

import '/imports/server/permissions.js'
import '/imports/server/publications.js'
import '/imports/server/methods.js'

import User from '/imports/both/models/User'

Accounts.config({ forbidClientAccountCreation: true })

Accounts.onCreateUser((options, user) => {
  user.profile = {}
  const profileOptions = options.profile
  Object.keys(profileOptions).forEach((key) => {
      user[key] = profileOptions[key]
  })
  return user
})
