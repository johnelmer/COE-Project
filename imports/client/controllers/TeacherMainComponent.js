import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import User from '/imports/both/models/User'
import '../views/teacher-main.html'

@State({
  name: 'app.teacher.main',
  url: '/teacher/courses',
  resolve: {
    redirect(user, $location) {
      Tracker.autorun(() => {
        if (!user) {
          $location.path('/login')
        }
      })
    },
  },
})

@State({
  name: 'app.teacher.courses',
  url: '/teacher/courses/:teacherId',
  resolve: {
    redirect(user, $location) {
      Tracker.autorun(() => {
        if (!user) {
          $location.path('/login')
        }
      })
    },
  },
})

@Component({
  selector: 'teacher-main',
  templateUrl: 'imports/client/views/teacher-main.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')

export default class TeacherMainComponent {

  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    const { teacherId } = $stateParams
    this.subscribe('role')
    this.subscribe('users', () => {
      const settingSubs = this.subscribe('settings')
      const courseSubs = this.subscribe('courses')
      const userSubs = this.subscribe('users')
      if (settingSubs.ready() && courseSubs.ready() && userSubs.ready()) {
        const currentUser = Meteor.user()
        const role = currentUser.roleName
        const isStateCourses = $state.current.name.endsWith('courses')
        if (role === 'dean' && isStateCourses) {
          const teacher = User.findOne({ _id: teacherId })
          this.courses = teacher.courses
        } else if (role !== 'dean' && isStateCourses) {
          $state.go('app.teacher.main')
        } else {
          this.user = currentUser
          this.courses = currentUser.courses
        }
      }
    })
  }
  get isCoursesReady() {
    const user = this.user
    if (user && user.courseIds.length > 0) {
      return this.courses.length > 0
    }
    return true
  }
}
