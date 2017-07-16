import Student from '/imports/both/models/Student'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Component, State, Inject } from 'angular2-now'
import '../views/student-list.html'

@State({
  name: 'app.student.list',
  url: '/students/list',
  resolve: {
    redirect(user, $location) {
      const isAuthorized = user.hasARole('secretary')
      return isAuthorized || $location.path('/login')
    },
  },
})
@Component({
  selector: 'student-list',
  templateUrl: 'imports/client/views/student-list.html',
})
@Inject('$scope', '$reactive', '$uibModal')
class StudentListComponent {

  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.subscribe('students')
    this.student = {}
    this.helpers({
      students() {
        return Student.find().fetch()
      },
    })
  }

  get isStudentsReady() {
    return this.students.length > 0
  }

  view(student) {
    this.student = student
  }

}

export default StudentListComponent
