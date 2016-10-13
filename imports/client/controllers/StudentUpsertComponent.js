/* eslint no-alert: "off" */

import { Component, State, Inject } from 'angular2-now'
import '../views/student-upsert'

import Student from '/imports/both/models/Student'

@State({
  name: 'app.student.create',
  url: '/students/create',
  defaultRoute: true,
})
@State({
  name: 'app.student.edit',
  url: '/students/edit/:studentId',
})
@Component({
  selector: 'student-upsert',
  templateUrl: 'imports/client/views/student-upsert.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class StudentUpsertComponent {

  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    this.buttonLabel = ''
    this.message = ''
    const { studentId } = $stateParams
    if ($state.current.name.endsWith('create')) {
      this.buttonLabel = 'Add Student'
      this.message = 'registered'
    } else {
      this.buttonLabel = 'Update Student'
      this.message = 'updated'
    }
    this.helpers({
      student() {
        if ($state.current.name.endsWith('create')) {
          return new Student
        }
        return Student.findOne({ _id: studentId })
      },
    })
  }

  save() {
    this.student.save(() => {
      const { firstName, lastName } = this.student
      alert(`${lastName}, ${firstName} ${this.message}!`)
      this.student = new Student
    })
  }
}


export default StudentUpsertComponent