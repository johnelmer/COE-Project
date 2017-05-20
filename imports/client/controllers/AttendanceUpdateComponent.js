// import Course from '/imports/both/models/Course'
import Session from '/imports/both/models/Session'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/attendance-update.html'

@State({
  name: 'app.course.session.attendanceUpdate',
  url: '/teacher/course/session/attendance/:sessionId',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('teacher') || $state.go('app.login')
    },
  },
})
@Component({
  selector: 'attendance-update',
  templateUrl: 'imports/client/views/attendance-update.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', '$q', 'ng-toast')
export default class AttendanceUpdateComponent {
  constructor($scope, $reactive, $state, $stateParams, ngToast) {
    $reactive(this).attach($scope)
    const { sessionId } = $stateParams
    this.subscribe('sessions', () => {
      this.subscribe('courses')
      this.subscribe('students-basic-infos')
      this.session = Session.findOne({ _id: sessionId })
      if (this.session) {
        this.students = this.session.attendances
      }
    })
    this.ngToast = ngToast
  }

  save() {
    const session = this.session
    session.studentAttendances = []
    this.students.forEach((student) => {
      const attendanceType = student.attendance
      if (attendanceType !== '') {
        session.addStudentAttendance(student, attendanceType)
      }
    })
    console.log(session) // TODO: remove console log
    session.save((err) => {
      if (err) {
        this.ngToast.create({
          dismissButton: true,
          className: 'danger',
          content: `${err.reason}`,
        })
      }
    })
  }
}
