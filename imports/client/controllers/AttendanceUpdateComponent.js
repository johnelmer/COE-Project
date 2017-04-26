import Course from '/imports/both/models/Course'
import Session from '/imports/both/models/Session'
import { Component, State, Inject } from 'angular2-now'
import '../views/attendance-update.html'

@State({
  name: 'app.course.session.attendanceUpdate',
  url: '/teacher/course/session/attendance/:sessionId',
})

@Component({
  selector: 'attendance-update',
  templateUrl: 'imports/client/views/attendance-update.html',
})

@Inject('$scope', '$reactive', '$state', '$stateParams', '$q')
export default class AttendanceUpdateComponent {
  constructor($scope, $reactive, $state, $stateParams) {
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
    console.log(session)
    session.save((err) => {
      if (err) { console.log(err) }
    })
  }
}