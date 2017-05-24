import User from '/imports/both/models/User'
import schema from '/imports/both/schemas/User'
import { Meteor } from 'meteor/meteor'
import Department from '/imports/both/models/Department'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-upsert.html'

@State({
  name: 'app.teacher.create',
  url: '/teacher/create',
  resolve: {
    redirect($location) {
      const user = Meteor.user()
      return user.hasARole('secretary') || $location.path('/login')
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
@Inject('$scope', '$reactive', '$state', '$stateParams', 'ngToast')
class TeacherUpsertComponent {
  static schema = schema
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
    try {
      schema.validate(this.teacher.doc)
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
        console.log(doc) // TODO: remove console log
        this.teacher = new User()
      })
    } catch (e) {
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: `${e.reason}`,
      })
    }
  }

}

export default TeacherUpsertComponent
