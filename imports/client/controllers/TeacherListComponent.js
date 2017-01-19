import User from '/imports/both/models/User'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-list.html'

@State({
  name: 'app.teacher.list',
  url: '/teacher/list',
})
@Component({
  selector: 'teacher-view',
  templateUrl: 'imports/client/views/teacher-view.html',
})
@Inject('$scope', '$reactive')
class TeacherListComponent {
  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.subscribe('users')
    this.teacher = {}
    this.helpers({
      teachers() {
        return User.find({ role: 'Teacher' }).fetch()
      },
    })
  }

  view(teacher) {
    this.teacher = teacher
  }
}

export default TeacherListComponent