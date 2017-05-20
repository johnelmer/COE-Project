import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import '../views/teacher-main.html'

import Course from '/imports/both/models/Course'

@State({
  name: 'app.course.teacher',
  url: '/teacher/main',
  resolve: {
    redirect($location) {
      if (!(Meteor.user())) {
        $location.path('/login')
      }
    },
  },
})
@Component({
  selector: 'teacher-main',
  templateUrl: 'imports/client/views/teacher-main.html',
})
@Inject('$scope', '$reactive')

export default class TeacherMainComponent {
  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.subscribe('role')
    this.subscribe('users', () => {
      const settingSubs = this.subscribe('settings')
      const courseSubs = this.subscribe('courses')
      const userSubs = this.subscribe('users')
      if (settingSubs.ready() && courseSubs.ready() && userSubs.ready()) {
        const user = Meteor.user()
        this.user = user
        if (user) {
          this.courses = user.courses
        }
      }
    })
  }
}
