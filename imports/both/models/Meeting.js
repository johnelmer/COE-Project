import SetupCollection from '../decorators/SetupCollection'
import Notification from './Notification'
import schema from '../schemas/Meeting.js'
import Model from './Model'
<<<<<<< HEAD
=======
import User from './User'
>>>>>>> a747f7c6eb60030d9220616193943b758e62e19f
import Idempotent from '../decorators/Idempotent'

@SetupCollection('Meetings')
class Meeting extends Model {

  static schema = schema

  createNotification() {
    const notif = new Notification()
    notif.type = 'Meeting'
    notif.title = this.title
    notif.date = this.createdAt
    notif.userIds = this.attendeeIds
    notif.content =  {
      header:  `WHEN: ${this.scedule} WHERE: ${this.location}`,
      body: this.description
    }
    notif.save((err, doc) => {
      if(!err) {
        this.notificationId = doc
      }
    })
  }
    
    @Idempotent
    get attendees() {
      return User.find({ _id: { $in: this.attendeeIds }}).fetch()
    }

    get notification() {
      return Notification.find({ _id: { $in: this.notificationId }})
    }
  }

export default Meeting
