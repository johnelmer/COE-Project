import Teacher from '/imports/both/models/User'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-view.html'

@State({
  name: 'app.teacher.view',
  url: '/teacher/view/:teacherId',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('secretary')
      return isAuthorized || $location.path('/login')
    },
    subs($stateParams) {
      return new Promise((resolve) => {
        Tracker.autorun(() => {
          const { teacherId } = $stateParams
          const teacher = Meteor.subscribe('user', teacherId)
          const subs = [teacher]
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
  selector: 'teacher-view',
  templateUrl: 'imports/client/views/teacher-view.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class TeacherViewComponent {

  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    const { teacherId } = $stateParams
    this.$state = $state
    this.helpers({
      teacher() {
        return Teacher.findOne({ _id: teacherId })
      },
    })
  }

  get defaultPicture() {
    const gender = {
      Male: '/defaults/default_male.png',
      Female: '/defaults/default_female.png',
    }
    const isFemale = this.teacher.gender === 'Female'
    const hasNoPicture = !(this.teacher.image.src)
    let displayImage = (hasNoPicture && isFemale) ? gender.Female : gender.Male
    displayImage = this.teacher.image.src || displayImage
    return displayImage
  }

  viewCourses() {
    this.$state.go('app.teacher.courses', { teacherId: this.teacher._id })
  }

  addSubject() {
    // code here
  }

  editSubject() {
    // code here
  }

}

export default TeacherViewComponent
