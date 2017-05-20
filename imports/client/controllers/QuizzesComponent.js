import { Component, State, Inject } from 'angular2-now'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import '../views/classrecord-quizzes-view.html'

@State({
  name: 'app.classrecord-quizzes',
  url: '/classrecord/quizzes',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('teacher') || $state.go('app.login')
    },
  },
})
@Component({
  selector: 'class-record-quizzes',
  templateUrl: 'classrecord-quizzes-view.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', '$uibModal')
class QuizzesComponent {
  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
  }
}

export default QuizzesComponent
