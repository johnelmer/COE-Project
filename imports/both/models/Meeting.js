import SetupCollection from '../decorators/SetupCollection'
import Notification from './Notification'
import schema from '../schemas/Meeting.js'
import Model from './Model'
import User from './User'
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
    notif.content = {
      header:  `WHEN: ${this.schedule.toLocaleString()} WHERE: ${this.location}`,
      body: this.description,
    }
    notif.save((err, doc) => {
      if (!err) {
        this.notificationId = doc
        const notification = Notification.findOne({ _id: doc })
        notification.notifyUsers()
      }
    })
    //console.log(this.notification)
  }
    
    @Idempotent
    get attendees() {
      return User.find({ _id: { $in: this.attendeeIds }}).fetch()
    }

    get notification() {
      return Notification.findOne({ _id: this.notificationId })
    }
  }

export default Meeting
