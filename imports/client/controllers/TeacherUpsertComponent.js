import User from '/imports/both/models/User'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-upsert.html'

@State({
  name: 'app.teacher.create',
  url: '/teacher/create',
})
@State({
  name: 'app.teacher.edit',
  url: '/teacher/edit/:teacherId',
})
@Component({
  selector: 'teacher-upsert',
  templateUrl: 'imports/client/views/teacher-upsert.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class TeacherUpsertComponent {

  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    this.buttonLabel = ''
    const teacherId = $stateParams
    if ($state.current.name.endsWith('create')) {
      this.buttonLabel = 'Register'
      this.message = 'registered'
    } else {
      this.buttonLabel = 'Update'
      this.message = 'updated'
    }
    this.helpers({
      teacher() {
        if ($state.current.name.endsWith('create')) {
          return new User
        }
        return User.findOne({ _id: teacherId })
      }
    })
  }

  save() {
    this.teacher.save(() => {
      const { firstName, lastName } = this.teacher.profile
      alert(`${lastName}, ${firstName} ${this.message}!`)
      this.teacher = new User()
    })
  }
}

export default TeacherUpsertComponent
