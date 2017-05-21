import { Component, State, Inject } from 'angular2-now'
import User from '/imports/both/models/User'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import 'ui-select/dist/select.css'
import '../views/meeting-upsert.html'

@State({
  name: 'app.meeting.create',
  url: '/meeting/create',
  resolve: {
    redirect($location, $meteor) {
      $meteor.subscribe('roles').then(() => {
        const user = Meteor.user()
        return user.hasARole('dean') || $location.path('/login')
      })
    },
  },
})
@State({
  name: 'app.meeting.edit',
  url: '/meeting/edit/:meetingId',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('teacher') || $state.go('app.login')
    },
  },
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
    this.helpers({
      attendees() {
        return User.find().fetch()
      },
    })
  }

}

export default MeetingUpsertComponent
