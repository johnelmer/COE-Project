import Student from '/imports/both/models/Student'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Component, State, Inject } from 'angular2-now'
import '../views/student-view.html'

@State({
  name: 'app.student.view',
  url: '/students/view/:studentId',
  resolve: {
    redirect: ['$location', ($location) => {
      const isAuthorized = Meteor.user() && Meteor.user().hasARole('faculty')
      return isAuthorized || $location.path('/login')
    }],
  },
})
@Component({
  selector: 'student-view',
  templateUrl: 'imports/client/views/student-view.html',
})
@Inject('$scope', '$reactive', '$stateParams')
class StudentViewComponent {

  constructor($scope, $reactive, $stateParams) {
    $reactive(this).attach($scope)
    this.isReady = false
    this.helpers({
      student() {
        const { studentId } = $stateParams
        const student = this.subscribe('student', () => {
          return [studentId]
        })
        const subs = [student]
        const isReady = subs.every(sub => sub.ready())
        if (isReady) {
          this.isReady = true
        }
        return Student.findOne()
      },
    })
  }

  get defaultPicture() {
    const gender = {
      Male: '/defaults/default_male.png',
      Female: '/defaults/default_female.png',
    }
    const isFemale = this.student.gender === 'Female'
    const hasNoPicture = this.student.image && !(this.student.image.src)
    let displayImage = (hasNoPicture && isFemale) ? gender.Female : gender.Male
    // this.student.image is sometimes undefined.
    // so this.student.image is needed.
    // since the this value is needed right after the DOM is loaded
    // regardless of the readiness of subscriptions
    displayImage = (this.student.image && this.student.image.src) || displayImage
    return displayImage
  }


  edit(student) {
    this.student = student
  }
}

export default StudentViewComponent
