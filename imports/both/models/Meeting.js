import SetupCollection from '../decorators/SetupCollection'
import Notification from './Notification'
import schema from '../schemas/Meeting.js'
import Model from './Model'

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
}

export default Meeting
