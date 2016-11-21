import Student from '/imports/both/models/Student'
import { Component, State, Inject } from 'angular2-now'
import '../views/student-view.html'

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
    this.student = student
  }
}

export default StudentViewComponent
