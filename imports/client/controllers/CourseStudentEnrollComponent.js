import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/course-student-enroll.html'

@State({
  name: 'app.course.enrollStudent',
  url: '/teacher/course/:courseId',
  resolve: {
    redirect($location) {
      const user = Meteor.user()
      return user.hasARole('faculty') || $location.path('/login')
    },
  },
})
@Component({
  selector: 'course-student-enroll',
  templateUrl: 'imports/client/views/course-student-enroll.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class CourseStudentEnrollComponent {

  constructor($scope, $reactive, $state, $stateParams) {
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
  }

  addToList() {
    const idNumber = this.student.idNumber
    const students = this.students
    const studentToBeAdded = Student.findOne({ idNumber: idNumber })
    if (!studentToBeAdded) {
      console.log('Student not found') // TODO: change to dynamic popup alert
    } else if (students.length > 0) {
      const isStudentExist = students.some(student => student.idNumber === idNumber)
      if (!isStudentExist) {
        students.push(studentToBeAdded)
      } else {
        console.log('Student is already on the list!') // TODO: change to dynamic popup alert
      }
    } else {
      students.push(studentToBeAdded)
    }
  }

/* TODO: select student from table */
  removeFromList(idNumber) {
    const studentIndex = this.studentList.findIndex(student => student.studentId === idNumber)
    if (studentIndex === -1) {
      console.log('Student is not on the list')
    }
    this.studentList.splice(studentIndex, 1)
  }

  enrollStudents() {
    this.studentList.forEach((student) => {
      try {
        this.course.enrollAStudent(student)
        this.course.save((err) => {
          if (err) { console.log(err) }
        })
      } catch (e) {
        console.log(`${student.firstName} ${student.lastName} is already enrolled!`)
      }
    })
    this.studentList = []
  }

}

export default CourseStudentEnrollComponent
