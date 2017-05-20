import Student from '/imports/both/models/Student'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/student-list.html'

@State({
  name: 'app.student.list',
  url: '/students/list',
  resolve: {
    redirect($location, $meteor) {
      $meteor.subscribe('roles').then(() => {
        const user = Meteor.user()
        return user.hasARole('secretary') || $location.path('/login')
      })
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

  view(student) {
    this.student = student
  }
}

export default StudentListComponent
