/* eslint no-alert: "off" */
import Student from '/imports/both/models/Student'
import schema from '/imports/both/schemas/Student'
import Degree from '/imports/both/models/Degree'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/student-upsert.html'

@State({
  name: 'app.student.create',
  url: '/students/create',
  resolve: {
    redirect($auth, $location) {
      $auth.awaitUser().then((user) => {
        if (user.hasARole('secretary')) {
          $location.path('/login')
        }
      })
    },
  },
})
@State({
  name: 'app.student.edit',
  url: '/students/edit/:studentId',
  // resolve: {
  //   redirect($state) {
  //     const { roleName } = Meteor.user()
  //     const role = Role.findOne({ name: roleName })
  //     return role.hasARole('secretary') || $state.go('app.login')
  //   },
  // },
})
@Component({
  selector: 'student-upsert',
  templateUrl: 'imports/client/views/student-upsert.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', 'ngToast')
class StudentUpsertComponent {
  static schema = schema
  constructor($scope, $reactive, $state, $stateParams, ngToast) {
    $reactive(this).attach($scope)
    this.buttonLabel = ''
    this.message = ''
    this.subscribe('students')
    this.subscribe('users')
    this.subscribe('degrees') // NOTE: added from temporary-branch
    const { studentId } = $stateParams
    if ($state.current.name.endsWith('create')) {
      this.buttonLabel = 'Add Student'
      this.message = 'registered'
    } else {
      this.buttonLabel = 'Update Student'
      this.message = 'updated'
    }
    this.helpers({
      student() {
        if ($state.current.name.endsWith('create')) {
          return new Student
        }
        return Student.findOne({ _id: studentId })
      },
      degrees() {
        return Degree.find().fetch()
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
  }

  save() {
    this.student.yearLevel = parseInt(this.student.yearLevel, 10)
    try {
      schema.validate(this.student.doc)
      this.student.save(() => {
        const { firstName, lastName } = this.student
        this.ngToast.create({
          dismissButton: true,
          className: 'success',
          content: `${lastName}, ${firstName} ${this.message}!`,
        })
        this.student = new Student
      })
    } catch (e) {
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: `${e.reason}`,
      })
    }
  }

  get isInvalidFirstName() {
    try {
      schema.pick('firstName').validate({ firstName: this.student.firstName })
      return false
    } catch (e) {
      return true
    }
  }

  get isInvalidLastName() {
    try {
      schema.pick('lastName').validate({ lastName: this.student.lastName })
      return false
    } catch (e) {
      return true
    }
  }

  get isInvalidIdNumber() {
    try {
      schema.pick('idNumber').validate({ idNumber: this.student.idNumber })
      return false
    } catch (e) {
      return true
    }
  }

  get isInvalidMiddleName() {
    try {
      schema.pick('middleName').validate({ middleName: this.student.middleName })
      return false
    } catch (e) {
      return true
    }
  }

  get isInvalidBirthday() {
    try {
      schema.pick('birthday').validate({ birthday: this.student.birthday })
      return false
    } catch (e) {
      return true
    }
  }

  get isInvalidHomeAddress() {
    try {
      schema.pick('homeAddress').validate({ homeAddress: this.student.homeAddress })
      return false
    } catch (e) {
      return true
    }
  }

  get isInvalidCityAddress() {
    try {
      schema.pick('cityAddress').validate({ cityAddress: this.student.cityAddress })
      return false
    } catch (e) {
      return true
    }
  }

  get isInvalidContactNumber() {
    try {
      schema.pick('contactNumber').validate({ contactNumber: this.student.contactNumber })
      return false
    } catch (e) {
      return true
    }
  }

  get isInvalidReligion() {
    try {
      schema.pick('religion').validate({ religion: this.student.religion })
      return false
    } catch (e) {
      return true
    }
  }

  get isInvalidCitizenship() {
    try {
      schema.pick('citizenship').validate({ citizenship: this.student.citizenship })
      return false
    } catch (e) {
      return true
    }
  }

  get isInvalidEmail() {
    try {
      schema.pick('email').validate({ email: this.student.email })
      return false
    } catch (e) {
      return true
    }
  }

  openPicker() {
    this.popup.opened = true
  }
}

export default StudentUpsertComponent
