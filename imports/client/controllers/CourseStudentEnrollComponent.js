import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import { Component, State, Inject } from 'angular2-now'
import '../views/course-student-enroll.html'

@State({
  name: 'app.course.enrollStudent',
  //url: '/teacher/course/:courseId',
  url: '/teacher/course',
})
@Component({
  selector: 'course-student-enroll',
  templateUrl: 'imports/client/views/course-student-enroll.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
export default class CourseStudentEnrollComponent {
  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    this.students = []
    this.student = {}
    const { courseIdParam } = $stateParams
    /* TODO: publication for unenrolled students for this course */
    this.subscribe('students')
    this.subscribe('courses')
    this.helpers({
      course() {
        const couseId = this.courseIdParam
        return Course.findOne({ couseId })
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
      console.log('Student not found')
    }
    const isStudentExist = students.some(student => student.idNumber === idNumber)
    if (!isStudentExist) {
      students.push(studentToBeAdded)
    } else {
      console.log('Student is already on the list!')
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
    console.log(this.course)
    this.studentList.forEach((student) => {
      this.course.enrollAStudent(student)
      this.course.save((err) => {
        if (err) { console.log(err) }
      })
    })
  }
}
