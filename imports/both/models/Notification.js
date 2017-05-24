import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Notification'

import Model from './Model'

@SetupCollection('Notifications')
class Notification extends Model {

  static schema = schema

  notifyUser() {
   return this.users.forEach(user => {
        user.notifications.push({ _id: this._id , isSeen: false })
        user.save()
    });
  }

  get users() {
      return User.find({ _id: { $in: this.userIds }}).fetch()
  }
}

export default Notification
