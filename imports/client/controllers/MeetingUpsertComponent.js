import { Component, State, Inject } from 'angular2-now'
import Meeting from '/imports/both/models/Meeting'
import Notification from '/imports/both/models/Notification'
import User from '/imports/both/models/User'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import 'ui-select/dist/select.css'
import '../views/meeting-upsert.html'

@State({
  name: 'app.meeting.create',
  url: '/meeting/create',
  resolve: {
    redirect($auth, $location) {
      $auth.awaitUser().then((user) => {
        if (user.hasARole('dean')) {
          $location.path('/login')
        }
      })
    },
  },
})
@State({
  name: 'app.meeting.edit',
  url: '/meeting/edit/:meetingId',
  // resolve: {
  //   redirect($state) {
  //     const { roleName } = Meteor.user()
  //     const role = Role.findOne({ name: roleName })
  //     return role.hasARole('teacher') || $state.go('app.login')
  //   },
  // },
})
@Component({
  selector: 'meeting-upsert',
  templateUrl: 'imports/client/views/meeting-upsert.html',
})
@Inject('$scope', '$reactive', '$state')
class MeetingUpsertComponent {

  constructor($scope, $reactive, $state) {
    $reactive(this).attach($scope)
    this.$state = $state
    this.subscribe('users')
    this.subscribe('meetings')
    this.meeting = ''
    this.helpers({
      meetings() {
        return Meeting.find().fetch()
      },
      attendees() {
        return User.find().fetch()
      },
      meeting() {
        if ($state.current.name.endsWith('create')) {
          return new Meeting({ attendeeIds: [] })
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

  save() {
    console.log(this.meeting);
    const meetingAttendees = this.selectedAttendees
    meetingAttendees.forEach(attendee => {
      this.meeting.attendeeIds.push(attendee._id)
    })
    this.meeting.save(err => {
      if(err) {
        console.log(err);
      }
    })
  }
  
  openPicker() {
    this.popup.opened = true
  }
}

export default MeetingUpsertComponent
