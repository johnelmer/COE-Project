import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import Course from '/imports/both/models/Course'
import '../views/teacher-main.html'

@State({
  name: 'app.teacher.main',
  url: '/teacher/courses',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('faculty')
      return isAuthorized || $location.path('/login')
    },
    subs() {
      return new Promise((resolve) => {
        Tracker.autorun(() => {
          const { _id } = Meteor.user()
          const setting = Meteor.subscribe('settings')
          const user = Meteor.subscribe('user', _id)
          const courses = Meteor.subscribe('teacherCourses', _id)
          const subs = [setting, user, courses]
          const isReady = subs.every(sub => sub.ready())
          if (isReady) {
            resolve(true)
          }
        })
      })
    },
  },
})

@State({
  name: 'app.teacher.courses',
  url: '/teacher/courses/:teacherId',
  resolve: {
    redirect(user, $location) {
      const isAuthorized = Meteor.user().hasARole('dean')
      return isAuthorized || $location.path('/login')
    },
    subs($stateParams) {
      return new Promise((resolve) => {
        Tracker.autorun(() => {
          const { teacherId } = $stateParams
          const setting = Meteor.subscribe('settings')
          const user = Meteor.subscribe('user', teacherId)
          const courses = Meteor.subscribe('teacherCourses', teacherId)
          const subs = [setting, user, courses]
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
  selector: 'teacher-main',
  templateUrl: 'imports/client/views/teacher-main.html',
})
@Inject('$scope', '$reactive')

export default class TeacherMainComponent {

  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.helpers({
      courses() {
        return Course.find().fetch()
      },
      user() {
        return Meteor.user()
      },
    })
    // this.subscribe('users', () => {
    //   const settingSubs = this.subscribe('settings')
    //   const courseSubs = this.subscribe('courses')
    //   const userSubs = this.subscribe('users')
    //   if (settingSubs.ready() && courseSubs.ready() && userSubs.ready()) {
    //     const currentUser = Meteor.user()
    //     const role = currentUser.roleName
    //     const isStateCourses = $state.current.name.endsWith('courses')
    //     if (role === 'dean' && isStateCourses) {
    //       const teacher = User.findOne({ _id: teacherId })
    //       this.courses = teacher.courses
    //     } else if (role !== 'dean' && isStateCourses) {
    //       $state.go('app.teacher.main')
    //     } else {
    //       this.user = currentUser
    //       this.courses = currentUser.courses
    //     }
    //   }
    // })
  }
  get isCoursesReady() {
    const user = this.user
    if (user && user.courseIds.length > 0) {
      return this.courses.length > 0
    }
    return true
  }
}
