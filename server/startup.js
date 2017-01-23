import User from '/imports/both/models/User'

function loadAccounts() {
  if (User.find().count() === 0) {
    const secretary = new User({
      username: 'secretary',
      password: 'iamsecretary',
      roleName: 'secretary',
    })
    secretary.save()
  }
}

export default loadAccounts
