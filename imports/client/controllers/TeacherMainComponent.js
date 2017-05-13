import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import '../views/teacher-main.html'

import Course from '/imports/both/models/Course'

@State({
  name: 'app.course.teacher',
  url: '/teacher/main/',
})
@Component({
  selector: 'teacher-main',
  templateUrl: 'imports/client/views/teacher-main.html',
})
@Inject('$scope', '$reactive')

export default class TeacherMainComponent {
  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.subscribe('users', () => {
      const settingSubs = this.subscribe('settings')
      const courseSubs = this.subscribe('courses')
      if (settingSubs.ready() && courseSubs.ready()) {
        const user = Meteor.user()
        console.log(user)
        this.user = user
        if (user) {
          this.courses = user.courses
          console.log(this.courses)
        }
      }
    })
  }
}
