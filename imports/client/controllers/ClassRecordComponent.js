import { Component, State, Inject } from 'angular2-now'
import '../views/classrecord.html'

@State({
  name: 'app.classrecord',
  url: '/classrecord',
})
@Component({
  selector: 'class-record',
  templateUrl: 'imports/client/views/classrecord.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class ClassRecordComponent {
  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
  }
}

export default ClassRecordComponent