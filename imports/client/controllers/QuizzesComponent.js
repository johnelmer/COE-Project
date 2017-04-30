import { Component, State, Inject } from 'angular2-now'
import '../views/classrecord-quizzes-view.html'

@State({
  name: 'app.classrecord-quizzes',
  url: '/classrecord/quizzes',
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
