import User from '/imports/both/models/User'
import Degree from '/imports/both/models/Degree'

function loadAccounts() {
  if (User.find().count() === 0) {
    const secretary = new User({
      username: 'secretary',
      password: 'iamsecretary',
      role: 'secretary',
      profile: {
        firstName: 'Maam',
        lastName: 'Secretary',
        middleName: 'M',
        idNumber: '10-1000-10',
        contactNumber: '09101010110',
        address: 'Jaro',
        department: '-',
      },
    })
    secretary.save()
  }
}

export default loadAccounts
