import { Component, State, Inject } from 'angular2-now'
import Meeting from '/imports/both/models/Meeting'
import Notification from '/imports/both/models/Notification'
import User from '/imports/both/models/User'
import Role from '/imports/both/models/Role'
import schema from '/imports/both/schemas/Meeting'
import { Meteor } from 'meteor/meteor'
import 'ui-select/dist/select.css'
import '../views/meeting-upsert.html'

@State({
  name: 'app.meeting.create',
  url: '/meeting/create',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('dean')
      return isAuthorized || $location.path('/login')
    },
  },
})
@State({
  name: 'app.meeting.edit',
  url: '/meeting/edit/:meetingId',
  resolve: {
    redirect(user, $location) {
      const isAuthorized = user.hasARole('teacher')
      return isAuthorized || $location.path('/login')
    },
  },
})
@Component({
  selector: 'meeting-upsert',
  templateUrl: 'imports/client/views/meeting-upsert.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class MeetingUpsertComponent {
  static schema = schema
  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    const { meetingId } = $stateParams
    this.$state = $state
    this.selectedAttendees = []
    this.subscribe('users')
    this.subscribe('meetings')
    this.helpers({
      meetings() {
        return Meeting.find().fetch()
      },
      attendees() {
        return User.find().fetch()
      },
      meeting() {
        if ($state.current.name.endsWith('create')) {
          return new Meeting()
        }
        return Meeting.findOne({ _id: meetingId })
      },
    })
    this.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
    }
    this.popup = {
      opened: false,
    }
    this.status = {
      isCustomHeaderOpen: false,
    }
    this.oneAtATime = true
  }

  openPicker() {
    this.popup.opened = true
  }
  save() {
    const time = this.time;
    const date = this.date;
    date.setHours(time.getHours())
    date.setMinutes(time.getMinutes())
    this.meeting.createdAt = new Date()
    this.meeting.schedule = date
    console.log(`Final ${this.meeting.schedule}`);
    this.meeting.attendeeIds = [];
    this.selectedAttendees.forEach(attendee => {
      this.meeting.attendeeIds.push(attendee._id)
    })
    this.meeting.save(err => {
      if(err) {
        console.log(err);
      }
    })
    this.meeting = new Meeting
  }
  get isInvalidTitle() {
    try {
      schema.pick('title').validate({ title: this.meeting.title })
      return false
    } catch (e) {
      return true
    }
  }
}

export default MeetingUpsertComponent
