import { Component, State, Inject } from 'angular2-now'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import '../views/classrecord-quizzes-view.html'

@State({
  name: 'app.classrecord-quizzes',
  url: '/classrecord/quizzes',
  resolve: {
    redirect($location, $meteor) {
      $meteor.subscribe('roles').then(() => {
        const user = Meteor.user()
        return user.hasARole('faculty') || $location.path('/login')
      })
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
