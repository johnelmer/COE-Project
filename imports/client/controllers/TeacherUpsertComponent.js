import User from '/imports/both/models/User'
import schema from '/imports/both/schemas/User'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import _ from 'underscore'
import Department from '/imports/both/models/Department'
import { Component, State, Inject } from 'angular2-now'
import '../views/teacher-upsert.html'

@State({
  name: 'app.teacher.create',
  url: '/teacher/create',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user() && Meteor.user().hasARole('secretary')
      return isAuthorized || $location.path('/login')
    },
  },
})
@State({
  name: 'app.teacher.edit',
  url: '/teacher/edit/:teacherId',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('secretary')
      return isAuthorized || $location.path('/login')
    },
  },
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
    const { teacherId } = $stateParams
    this.autorun(() => {
      const departments = this.subscribe('departments')
      let subs = [departments];
      if ($state.current.name.endsWith('create')) {
        this.buttonLabel = 'Register'
      } else {
        const teacherSub = this.subscribe('user', () => [teacherId])
        subs = [departments, teacherSub];
        this.buttonLabel = 'Update'
      }
      this.isReady = subs.every(sub => sub.ready())
    })
    this.helpers({
      teacher() {
        if ($state.current.name.endsWith('create')) {
          return new User()
        }
        return User.findOne({ _id: teacherId })
      },
      departments() {
        return Department.find().fetch()
      },
    })
    this.ngToast = ngToast
    this.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
    }
    this.popup = {
      opened: false,
    }
    this.$state = $state
  }

  save() {
    try {
      schema.validate(_.omit(this.teacher.doc, ['password', 'reenterPassword']))
      this.teacher.save(() => {
        this.teacher = new User()
        this.teacher.reenterPassword = ''
      })
      this.ngToast.create({
        dismissButton: true,
        className: 'success',
        content: `${this.teacher.lastName} added!`,
      })
    } catch (e) {
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: `${e.reason}`,
      })
    }
    this.$state.go('app.teacher.view', { teacherId: this.teacher._id })
  }

  openPicker() {
    this.popup.opened = true
  }

  get isInvalidLastName() {
    try {
      schema.pick('lastName').validate({ lastName: this.teacher.lastName })
      return false
    } catch (e) {
      this.invalidLastNameMessage = e.reason
      return true
    }
  }

  get isInvalidFirstName() {

  }

  get isInvalidMiddleName() {

  }
}

export default TeacherUpsertComponent
