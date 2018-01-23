import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import Course from '/imports/both/models/Course'
import User from '/imports/both/models/User'
import '../views/teacher-main.html'

@State({
  name: 'app.teacher.main',
  url: '/teacher/courses',
  resolve: {
    redirect($location) {
      return new Promise((resolve) => {
        const hasAUser = Meteor.user()
        const isAuthorized = hasAUser && Meteor.user().hasARole('faculty')
        if (!isAuthorized) {
          $location.path('/login')
        }
        resolve(isAuthorized)
      })
    },
  },
})
@State({
  name: 'app.teacher.courses',
  url: '/teacher/courses/:teacherId',
  resolve: {
    redirect(user, $location) {
      return new Promise((resolve) => {
        const isAuthorized = Meteor.user().hasARole('dean')
        if (!isAuthorized) {
          $location.path('/login')
        }
        resolve(isAuthorized)
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
    this.helpers({
      courses() {
        const endsWithCourses = $state.current.name.endsWith('courses')
        const teacherId = endsWithCourses && $stateParams.teacherId
        const setting = this.subscribe('settings')
        const id = endsWithCourses ? teacherId : Meteor.userId()
        const user = this.subscribe('user', () => [id])
        const courses = this.subscribe('teacherCourses', () => [id])
        const subs = [setting, user, courses]
        this.isReady = subs.every(sub => sub.ready())
        return Course.find().fetch()
      },
      user() {
        const endsWithMain = $state.current.name.endsWith('main')
        const { teacherId } = $stateParams
        if (endsWithMain) {
          return Meteor.user()
        }
        return User.findOne({ _id: teacherId })
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

  getLastUrlWord(word) { // word kai wala spaces
    const words = word.split('/')
    return words.pop()
  }

  get isCoursesReady() {
    const user = this.user
    if (user && user.courseIds.length > 0) {
      return this.courses.length > 0
    }
    return true
  }
}
