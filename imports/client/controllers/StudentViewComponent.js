import { Component, State, Inject} from 'angular2-now'
import '../views/student-view'

import Student from '/imports/both/models/Student'

@State({
    name: 'app.student.list',
    url: '/students/list',
})
@Component({
    selector: 'student-view',
    templateUrl: 'imports/client/views/student-view.html',
})
@Inject('$scope', '$reactive')
class StudentViewComponent {
  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.student = {}
    this.helpers({
      students() {
        return Student.find().fetch()
      }
    })
  }

  view(student) {
    console.log(student)
    this.student = student
    console.log(this.student)
  }
}

export default StudentViewComponent
