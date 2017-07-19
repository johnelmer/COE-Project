import Teacher from '/imports/both/models/User'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-view.html'

@State({
  name: 'app.teacher.view',
  url: '/teacher/view/:teacherId',
  resolve: {
    redirect(user, $location) {
      const isAuthorized = user.hasARole('secretary')
      return isAuthorized || $location.path('/login')
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
    this.subscribe('users')
    this.$state = $state
    this.helpers({
      teacher() {
        return Teacher.findOne({ _id: teacherId })
      },
    })
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
