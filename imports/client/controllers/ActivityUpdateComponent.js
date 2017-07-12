import Activity from '/imports/both/models/Activity'
import schema from '/imports/both/schemas/Activity'
import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import 'ng-toast/dist/ngToast.css'
import '../views/activity-update.html'

@State({
  name: 'app.course.session.activityUpdate',
  url: '/teacher/course/session/activity/:activityId',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('faculty')
      return isAuthorized || $location.path('/login')
    },
  },
})
@Component({
  selector: 'activity-update',
  templateUrl: 'imports/client/views/activity-update.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', '$q', 'ngToast')
class ActivityUpdateComponent {
  static schema = schema
  constructor($scope, $reactive, $state, $stateParams, ngToast) {
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
    this.ngToast = ngToast
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
    try {
      schema.validate(this.activity.doc)
      activity.save((err) => {
        if (err) {
          this.ngToast.create({
            dismissButton: true,
            className: 'danger',
            content: `${err.reason}`,
          })
        }
      })
    } catch (e) {
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: `${e.reason}`,
      })
    }
  }

}

export default ActivityUpdateComponent
