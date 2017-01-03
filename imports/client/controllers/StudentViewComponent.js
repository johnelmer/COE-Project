import Student from '/imports/both/models/Student'
import { Component, State, Inject } from 'angular2-now'
import '../views/student-view.html'

@State({
  name: 'app.student.view',
  url: '/students/view/:studentId',
})
@Component({
  selector: 'student-view',
  templateUrl: 'imports/client/views/student-view.html',
})
@Inject('$scope', '$reactive', '$stateParams')
class StudentViewComponent {
  constructor($scope, $reactive, $stateParams) {
    $reactive(this).attach($scope)
    const { studentId } = $stateParams
    this.subscribe('students')
    this.helpers({
      student() {
        return Student.findOne({ _id: studentId })
      },
    })
  }
}

export default StudentViewComponent
