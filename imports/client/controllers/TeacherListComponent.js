import User from '/imports/both/models/User'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-list.html'

@State({
  name: 'app.teacher.list',
  url: '/teacher/list',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('secretary')
      return isAuthorized || $location.path('/login')
    },
    subs() {
      return new Promise((resolve) => {
        Tracker.autorun(() => {
          const teachers = Meteor.subscribe('teachers')
          const subs = [teachers]
          const isReady = subs.every(sub => sub.ready())
          if (isReady) {
            resolve(true)
          }
        })
      })
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
    this.helpers({
      teachers() {
        return User.find().fetch()
      },
    })
  }

  view(teacher) {
    this.teacher = teacher
  }

}

export default TeacherListComponent
