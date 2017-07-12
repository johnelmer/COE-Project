import { Component, State, Inject } from 'angular2-now'
import '../views/custom-grading-template.html'

@State({
  name: 'app.custom.template',
  url: '/teacher/course/classrecord/custom/gradingtemplate',
})
@Component({
  selector: 'custom-template',
  templateUrl: 'imports/client/views/custom-grading-template.html',
})
class CustomGradingTemplateComponent {
  constructor($scope, $reactive, $stateParams) {
    $reactive(this).attach($scope)
  }
}
export default CustomGradingTemplateComponent
