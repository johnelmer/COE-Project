import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import { Component, State, Inject } from 'angular2-now'
import '../views/course-student-enroll.html'

@State({
  name: 'app.course.enrollStudent',
  url: '/teacher/course/:courseId',
})
@Component({
  selector: 'course-student-enroll',
  templateUrl: 'imports/client/views/course-student-enroll',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class CourseStudentEnrollComponent {
  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    this.studentList = []
    const { courseId } = $stateParams
    this.helpers({
      course() {
        return Course.findOne({ courseId })
      },
    })
    this.enrolledStudents = this.course.students
  }

  addToList(idNumber) {
    const student = Student.findOne({ studentId: idNumber })
    if (!student) {
      console.log('Student not found')
    }
    this.studentList.push(student)
  }

  removeFromList(idNumber) {
    const studentIndex = this.studentList.findIndex(student => student.studentId === idNumber)
    if (studentIndex === -1) {
      console.log('Student is not on the list')
    }
    this.studentList.splice(studentIndex, 1)
  }

  enrollStudents() {
    this.studentList.forEach((student) => {
      this.course.enrollAStudent(student)
      this.course.save()
    })
  }

  removeStudentFromClass(idNumber) {
    const course = this.course
    course.removeStudentFromClass(idNumber)
    course.save((err) => {
      if (err) {
        console.log('Error')
      }
    })
  }
}
