import Teacher from '/imports/both/models/User'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-view.html'

@State({
  name: 'app.teacher.view',
  url: '/teacher/view/:teacherId',
  resolve: {
    // redirect($auth, $location) {
    //   $auth.awaitUser().then((user) => {
    //     if (user.hasARole('secretary')) {
    //       $location.path('/login')
    //     }
    //   })
    // },

  },
})
@Component({
  selector: 'teacher-view',
  templateUrl: 'imports/client/views/teacher-view.html',
})
@Inject('$scope', '$reactive', '$stateParams')
class TeacherViewComponent {

  constructor($scope, $reactive, $stateParams) {
    $reactive(this).attach($scope)
    const { teacherId } = $stateParams
    this.subscribe('users')
    this.helpers({
      teacher() {
        return Teacher.findOne({ _id: teacherId })
      },
    })
  }

  addSubject() {
    // code here
  }

  editSubject() {
    // code here
  }

}

export default TeacherViewComponent
