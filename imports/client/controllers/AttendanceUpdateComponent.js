import Session from '/imports/both/models/Session'
import schema from '/imports/both/schemas/Session'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import 'ng-toast/dist/ngToast.css'
import '../views/attendance-update.html'

@State({
  name: 'app.course.session.attendanceUpdate',
  url: '/teacher/course/session/attendance/:sessionId',
  resolve: {
    redirect(user, $location) {
      const isAuthorized = user.hasARole('faculty')
      return isAuthorized || $location.path('/login')
    },
  },
})
@Component({
  selector: 'attendance-update',
  templateUrl: 'imports/client/views/attendance-update.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', 'ngToast')
class AttendanceUpdateComponent {
  static schema = schema
  constructor($scope, $reactive, $state, $stateParams, ngToast) {
    $reactive(this).attach($scope)
    const { sessionId } = $stateParams
    this.subscribe('sessions', () => {
      this.subscribe('courses')
      this.subscribe('students-basic-infos')
      this.session = Session.findOne({ _id: sessionId })
      if (this.session) {
        this.students = this.session.attendances
        this.attendanceTypes = Session.schema._schema['studentAttendances.$.type'].allowedValues
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
    try {
      schema.validate(this.session.doc)
      session.save((err) => {
        if (err) {
          console.log(err)
          this.ngToast.create({
            dismissButton: true,
            className: 'danger',
            content: `${err.reason}`,
          })
        }
      })
    } catch (e) {
      console.log(e)
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: `${e.reason}`,
      })
    }
  }

}

export default AttendanceUpdateComponent
