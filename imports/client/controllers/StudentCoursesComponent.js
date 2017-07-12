import Student from '/imports/both/models/Student'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/student-courses.html'

@State({
  name: 'app.student.courses',
  url: '/student/courses/:studentId',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('faculty')
      return isAuthorized || $location.path('/login')
    },
  },
})
@Component({
  selector: 'student-courses',
  templateUrl: 'imports/client/views/student-courses.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class StudentCoursesComponent {

  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    const { studentId } = $stateParams
    this.subscribe('students', () => {
      const courseSubs = this.subscribe('courses')
      const sessionSubs = this.subscribe('sessions')
      const activitySubs = this.subscribe('activities')
      const activityTypeSubs = this.subscribe('activity-types')
      const gradingSubs = this.subscribe('grading-templates')
      const settingSubs = this.subscribe('settings')
      const gradeTransmutationSubs = this.subscribe('grade-transmutations')
      this.student = Student.findOne({ _id: studentId })
      const student = this.student
      if (courseSubs.ready() && sessionSubs.ready() && activitySubs.ready()
          && activitySubs.ready() && activityTypeSubs.ready() && gradingSubs.ready()
          && settingSubs.ready() && gradeTransmutationSubs.ready() && student) {
        this.records = student.coursesGrades
      }
    })
  }
}

export default StudentCoursesComponent
