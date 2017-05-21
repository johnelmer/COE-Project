import User from '/imports/both/models/User'
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
@Inject('$scope', '$reactive', '$state', '$stateParams')
class TeacherUpsertComponent {

  constructor($scope, $reactive, $state, $stateParams) {
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
  }

  save() {
    console.log(this.teacher);
    this.teacher.save((err, doc) => {
      console.log(err)
      console.log(doc)
      this.teacher = new User()
    })
  }

}

export default TeacherUpsertComponent
