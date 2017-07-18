import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import 'ng-toast/dist/ngToast.css'
import '../views/course-student-enroll.html'

@State({
  name: 'app.course.enrollStudent',
  url: '/teacher/course/:courseId',
  resolve: {
    redirect(user, $location) {
      const isAuthorized = user.hasARole('faculty')
      return isAuthorized || $location.path('/login')
    },
  },
})
@Component({
  selector: 'course-student-enroll',
  templateUrl: 'imports/client/views/course-student-enroll.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', 'ngToast')
class CourseStudentEnrollComponent {

  constructor($scope, $reactive, $state, $stateParams, ngToast) {
    $reactive(this).attach($scope)
    this.students = []
    this.student = {}
    const { courseId } = $stateParams
    const studentSubs = this.subscribe('students')
    this.subscribe('courses', () => {
      if (studentSubs.ready()) {
        const course = Course.findOne({ _id: courseId })
        this.enrolledStudents = course.students
        this.students = Student.find().fetch()
        this.course = course
      }
    })
    this.ngToast = ngToast
  }

  enrollStudent() {
    const enrolledStudents = this.enrolledStudents
    let student = this.student
    const isExists = this.students.some(enrolledStudent => enrolledStudent.idNumber === student.idNumber)
    if (!isExists) {
      this.ngToast.create({
        dismissButton: true,
        className: 'warning',
        content: 'Student not found',
      })
    } else {
      const isAlreadyEnrolled = enrolledStudents.some(enrolledStudent => enrolledStudent.idNumber === student.idNumber)
      if (!isAlreadyEnrolled) {
        enrolledStudents.push(student)
        this.course.studentIds.push(student._id)
        student = {}
      } else {
        this.ngToast.create({
          dismissButton: true,
          className: 'danger',
          content: 'Student is already enrolled!',
        })
      }
    }
  }

  removeStudent(student) {
    const studentIds = this.course.studentIds
    const index = studentIds.findIndex(id => id === student._id)
    if (index === -1) {
      this.ngToast.create({
        dismissButton: true,
        className: 'warning',
        content: 'Student is not on the list',
      })
    } else {
      const enrolledStudents = this.enrolledStudents
      studentIds.splice(index, 1)
      const enrolledStudentIndex = enrolledStudents.findIndex(enrolledStudent => enrolledStudent._id === student._id)
      enrolledStudents.splice(enrolledStudentIndex, 1)
    }
  }

  enrollStudents() {
    this.course.save((err) => {
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

export default CourseStudentEnrollComponent
