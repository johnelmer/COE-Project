import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Notification'
import User from '/imports/both/models/User' 

import Model from './Model'

@SetupCollection('Notifications')
class Notification extends Model {

  static schema = schema

  notifyUsers() {
    console.log(this.users)
    this.users.forEach((user) => {
        if (!user.notificationIds) {
          user.notificationIds = []
        }
        user.notificationIds.push(this._id)
        console.log(user)
        user.save(err => console.log(err))
    });
  }

  get users() {
      return User.find({ _id: { $in: this.userIds }}).fetch()
  }
}

export default Notification
