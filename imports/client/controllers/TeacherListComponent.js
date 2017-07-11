import User from '/imports/both/models/User'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-list.html'

@State({
  name: 'app.teacher.list',
  url: '/teacher/list',
  resolve: {
    redirect(user, $location) {
      const isAuthorized = user.hasARole('secretary')
      return isAuthorized || $location.path('/login')
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
