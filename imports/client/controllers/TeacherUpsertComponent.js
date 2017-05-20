import User from '/imports/both/models/User'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import Department from '/imports/both/models/Department'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-upsert.html'

@State({
  name: 'app.teacher.create',
  url: '/teacher/create',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('secretary') || $state.go('app.login')
    },
  },
})
@State({
  name: 'app.teacher.edit',
  url: '/teacher/edit/:teacherId',
})
@Component({
  selector: 'teacher-upsert',
  templateUrl: 'imports/client/views/teacher-upsert.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', 'ng-toast')
class TeacherUpsertComponent {

  constructor($scope, $reactive, $state, $stateParams, ngToast) {
    $reactive(this).attach($scope)
    this.buttonLabel = ''
    this.subscribe('departments')
    const teacherId = $stateParams
    if ($state.current.name.endsWith('create')) {
      this.buttonLabel = 'Register'
    } else {
      this.buttonLabel = 'Update'
    }
    this.helpers({
      teacher() {
        if ($state.current.name.endsWith('create')) {
          return new User
        }
        return User.findOne({ _id: teacherId })
      },
      departments() {
        return Department.find().fetch()
      },
    })
    this.ngToast = ngToast
  }

  save() {
    console.log(this.teacher);
    this.teacher.save((err, doc) => {
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: `${err.reason}`,
      })
      this.ngToast.create({
        dismissButton: true,
        className: 'success',
        content: `${this.teacher} added!`,
      })
      console.log(doc)
      this.teacher = new User()
    })
  }
}

export default TeacherUpsertComponent
