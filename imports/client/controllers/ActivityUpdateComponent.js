import Course from '/imports/both/models/Course'
import Activity from '/imports/both/models/Activity'
import { Component, State, Inject } from 'angular2-now'
import '../views/activity-update.html'

@State({
  name: 'app.course.session.activityUpdate',
  url: '/teacher/course/session/activity/:activityId',
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
      if (err) { console.log(err) }
    })
  }
}
