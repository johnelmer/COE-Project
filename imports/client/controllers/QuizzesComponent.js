import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import '../views/classrecord-quizzes-view.html'

@State({
  name: 'app.classrecord-quizzes',
  url: '/classrecord/quizzes',
  resolve: {
    redirect: ['$location', ($location) => {
      const isAuthorized = Meteor.user() && Meteor.user().hasARole('faculty')
      return isAuthorized || $location.path('/login')
    }],
  },
})
@Component({
  selector: 'class-record-quizzes',
  templateUrl: 'classrecord-quizzes-view.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class QuizzesComponent {

  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
  }

}

export default QuizzesComponent
