import User from '/imports/both/models/User'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-list.html'

@State({
  name: 'app.teacher.list',
  url: '/teacher/list',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('secretary') || $state.go('app.login')
    },
  },
})
@Component({
  selector: 'teacher-list',
  templateUrl: 'imports/client/views/teacher-list.html',
})
@Inject('$scope', '$reactive')
class TeacherListComponent {
  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.subscribe('users', () => {
      this.teachers = User.find({ roleName: 'faculty' }).fetch()
    })
    this.teacher = {}
  }

  view(teacher) {
    this.teacher = teacher
  }
}

export default TeacherListComponent
