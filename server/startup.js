import User from '/imports/both/models/User'

function loadAccounts() {
  if (User.find().count() === 0) {
    const secretary = new User({
      username: 'secretary',
      password: 'iamsecretary',
      profile: {
        firstName: 'Maam',
        lastName: 'Secretary',
        middleName: 'M',
        idNumber: '10-1000-10',
        contactNumber: '09101010110',
        address: 'Jaro',
        department: '-',
        roleName: 'secretary',
      },
    })
    secretary.save()
  }
}

export default loadAccounts
