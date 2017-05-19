import Course from '/imports/both/models/Course'
import Activity from '/imports/both/models/Activity'
import Role from '/imports/both/models/Role'
import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import '../views/activity-update.html'

@State({
  name: 'app.course.session.activityUpdate',
  url: '/teacher/course/session/activity/:activityId',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('teacher') || $state.go('app.login')
    },
  },
})
@Component({
  selector: 'activity-update',
  templateUrl: 'imports/client/views/activity-update.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', '$q')
export default class ActivityUpdateComponent {
  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    const { activityId } = $stateParams
    this.subscribe('activities', () => {
      this.subscribe('sessions')
      this.subscribe('courses')
      this.subscribe('students-basic-infos')
      this.activity = Activity.findOne({ _id: activityId })
      if (this.activity) {
        this.students = this.activity.studentRecords
      }
    })
  }

  save() {
    const activity = this.activity
    activity.records = []
    this.students.forEach((student) => {
      const score = student.score
      if (score !== '') {
        activity.addScore(student, student.score)
      }
    })
    activity.save((err) => {
      if (err) { console.log(err) } //TODO: remove console log and change to dynamic ui content
    })
  }
}
