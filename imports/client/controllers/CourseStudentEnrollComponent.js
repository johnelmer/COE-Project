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
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('faculty')
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
    /* TODO: publication for unenrolled students for this course */
    const studentSubs = this.subscribe('students')
    const courseSubs = this.subscribe('courses')
    if (studentSubs.ready() && courseSubs.ready()) {
      this.course = Course.findOne({ _id: courseId })
      this.studentList = this.course.students
      console.log(this.studentList)
    }
    this.ngToast = ngToast
  }

  addToList() {
    const idNumber = this.student.idNumber
    const students = this.students
    const studentToBeAdded = Student.findOne({ idNumber: idNumber })
    if (!studentToBeAdded) {
      this.ngToast.create({
        dismissButton: true,
        className: 'warning',
        content: 'Student not found',
      })
    } else if (students.length > 0) {
      const isStudentExist = this.studentList.some(student => student.idNumber === idNumber)
      if (!isStudentExist) {
        students.push(studentToBeAdded)
      } else {
        this.ngToast.create({
          dismissButton: true,
          className: 'danger',
          content: 'Student is already on the list!',
        })
      }
    } else {
      students.push(studentToBeAdded)
    }
  }

/* TODO: select student from table */
  removeFromList(idNumber) {
    const studentIndex = this.studentList.findIndex(student => student.studentId === idNumber)
    if (studentIndex === -1) {
      this.ngToast.create({
        dismissButton: true,
        className: 'warning',
        content: 'Student is not on the list',
      })
    }
    this.studentList.splice(studentIndex, 1)
  }

  enrollStudents() {
    this.studentList.forEach((student) => {
      try {
        this.course.enrollAStudent(student)
        this.course.save((err) => {
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
          content: `${student.firstName} ${student.lastName} is already enrolled!`,
        })
      }
    })
    this.studentList = []
  }

}

export default CourseStudentEnrollComponent
