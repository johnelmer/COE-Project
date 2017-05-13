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
  // TODO: code here
}

export default ClassRecordComponent
