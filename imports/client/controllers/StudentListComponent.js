import Student from '/imports/both/models/Student'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/student-list.html'

@State({
  name: 'app.student.list',
  url: '/students/list',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('secretary') || $state.go('app.login')
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
