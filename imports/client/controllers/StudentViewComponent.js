import Student from '/imports/both/models/Student'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/student-view.html'

@State({
  name: 'app.student.view',
  url: '/students/view/:studentId',
  resolve: {
    redirect($state) {
      const isAuthorized = Meteor.user().hasARole('faculty')
      return isAuthorized || $state.path('/login')
    },

    // redirect($auth, $location) {
    //   $auth.awaitUser().then((user) => {
    //     if (user.hasARole('faculty')) {
    //       $location.path('/login')
    //     }
    //   })
    // },
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
    const { studentId } = $stateParams
    this.subscribe('students')
    this.helpers({
      student() {
        return Student.findOne({ _id: studentId })
      },
    })
  }

  get defaultPicture() {
    const gender = {
      Male: '/defaults/default_male.png',
      Female: '/defaults/default_female.png',
    }
    const isFemale = this.student.gender === 'Female'
    const hasNoPicture = !(this.student.image.src)
    let displayImage = (hasNoPicture && isFemale) ? gender.Female : gender.Male
    displayImage = this.student.image.src || displayImage
    return displayImage
  }


  edit(student) {
    this.student = student
  }
}

export default StudentViewComponent
