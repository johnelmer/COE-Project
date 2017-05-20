import Teacher from '/imports/both/models/User'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-view.html'

@State({
  name: 'app.teacher.view',
  url: '/teacher/view/:teacherId',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('secretary') || $state.go('app.login')
    },
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
    //code here
  }

  editSubject() {
    //code here
  }
}

export default TeacherViewComponent
