/* eslint no-alert: "off" */
import Student from '/imports/both/models/Student'
import { Component, State, Inject } from 'angular2-now'
import Degree from '/imports/both/models/Degree'
import '../views/student-upsert.html'

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
    this.subscribe('degrees')
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
      degrees() {
        return Degree.find().fetch()
      },
    })
  }

  save() {
    console.log(this.student)
    this.student.save((doc, err) => {
      const { firstName, lastName } = this.student
      alert(`${lastName}, ${firstName} ${this.message}!`)
      this.student = new Student
      console.log(doc)
      console.log(err)
    })
  }
}


export default StudentUpsertComponent
