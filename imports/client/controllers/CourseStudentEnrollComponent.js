import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/course-student-enroll.html'

@State({
  name: 'app.course.enrollStudent',
  url: '/teacher/course/:courseId',
  resolve: {
    redirect($location, $meteor) {
      $meteor.subscribe('roles').then(() => {
        const user = Meteor.user()
        return user.hasARole('faculty') || $location.path('/login')
      })
    },
  },
})
@Component({
  selector: 'course-student-enroll',
  templateUrl: 'imports/client/views/course-student-enroll.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', 'ngToast')
export default class CourseStudentEnrollComponent {
  constructor($scope, $reactive, $state, $stateParams, ngToast) {
    $reactive(this).attach($scope)
    this.students = []
    this.student = {}
    const { courseId } = $stateParams
    /* TODO: publication for unenrolled students for this course */
    this.subscribe('students')
    this.subscribe('courses')
    this.helpers({
      course() {
        const course = Course.findOne({ _id: courseId })
        if (!course) {
          // redirect
        }
        return course
      },
      studentList() {
        return this.students
      },
    })
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
      const isStudentExist = students.some(student => student.idNumber === idNumber)
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
