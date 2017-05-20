import Student from '/imports/both/models/Student'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/student-view.html'

@State({
  name: 'app.student.view',
  url: '/students/view/:studentId',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('teacher') || $state.go('app.login')
    },
  },
})
@Component({
  selector: 'student-view',
  templateUrl: 'imports/client/views/student-view.html',
})
@Inject('$scope', '$reactive', '$stateParams')
class StudentViewComponent {
  constructor($scope, $reactive, $stateParams) {
    $reactive(this).attach($scope)
    const { studentId } = $stateParams
    this.subscribe('students')
    this.helpers({
      student() {
        return Student.findOne({ _id: studentId })
      },
    })
  }
}

export default StudentViewComponent
