import { Component, State, Inject } from 'angular2-now'
import User from '/imports/both/models/User'
import 'ui-select/dist/select.css'
import '../views/meeting-upsert.html'

@State({
  name: 'app.meeting.create',
  url: '/meeting/create',
})
@State({
  name: 'app.meeting.edit',
  url: '/meeting/edit/:meetingId',
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
