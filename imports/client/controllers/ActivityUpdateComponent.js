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
    redirect: ['$location', ($location) => {
      const isAuthorized = Meteor.user() && Meteor.user().hasARole('faculty')
      return isAuthorized || $location.path('/login')
    }],
  },
})
@Component({
  selector: 'activity-update',
  templateUrl: 'imports/client/views/activity-update.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', 'ngToast', '$location')
class ActivityUpdateComponent {
  static schema = schema
  constructor($scope, $reactive, $state, $stateParams, ngToast) {
    $reactive(this).attach($scope)
    const { activityId } = $stateParams
    this.subscribe('activities', () => {
      this.subscribe('sessions')
      this.subscribe('courses')
      this.subscribe('currentUser')
      this.subscribe('students-basic-infos')
      const activity = Activity.findOne({ _id: activityId })
      this.activity = activity
      if (this.activity) {
        this.students = this.activity.studentRecords
        const user = Meteor.user()
        this.user = user
        if (activity.isLocked && user.roleName !== 'dean') {
          $state.go('app.course.classRecord', { courseId: activity.session.courseId })
        }
      }
    })
    this.ngToast = ngToast
    this.$state = $state
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
    this.$state.go('app.course.classRecord', { courseId: this.activity.session.courseId })
  }

}

export default ActivityUpdateComponent
