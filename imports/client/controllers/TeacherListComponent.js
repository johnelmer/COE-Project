import User from '/imports/both/models/User'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-list.html'

@State({
  name: 'app.teacher.list',
  url: '/teacher/list',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user() && Meteor.user().hasARole('secretary')
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
    this.isReady = false
    this.helpers({
      teachers() {
        const teachers = this.subscribe('teachers')
        const subs = [teachers]
        const isReady = subs.every(sub => sub.ready())
        if (isReady) {
          this.isReady = true
        }
        return User.find({ _id: { $ne: Meteor.userId() } }).fetch()
      },
    })
  }

  view(teacher) {
    this.teacher = teacher
  }

}

export default TeacherListComponent
