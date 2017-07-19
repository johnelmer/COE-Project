/* eslint no-alert: "off" */
/* eslint-disable no-param-reassign */
import Student from '/imports/both/models/Student'
import schema from '/imports/both/schemas/Student'
import Degree from '/imports/both/models/Degree'
import Role from '/imports/both/models/Role'
import XLSX from 'xlsx'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import 'ng-file-upload/dist/ng-file-upload.min.js'
import '../views/student-upsert.html'
import '../styles/studentUpsert.scss'

@State({
  name: 'app.student.create',
  url: '/students/create',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('secretary')
      return isAuthorized || $location.path('/login')
    },

    // redirect($auth, $location) {
    //   $auth.awaitUser().then((user) => {
    //     if (user.hasARole('secretary')) {
    //       $location.path('/login')
    //     }
    //   })
    // },
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
@Inject('$scope', '$reactive', '$state', '$stateParams', 'ngToast', 'Upload', '$timeout')
class StudentUpsertComponent {
  static schema = schema
  constructor($scope, $reactive, $state, $stateParams, ngToast, Upload, $timeout) {
    $reactive(this).attach($scope)
    this.buttonLabel = ''
    this.message = ''
    this.subscribe('students')
    this.Upload = Upload
    this.$timeout = $timeout
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
    this.$state = $state
  }

  uploadFiles(file, errFiles) {
    this.file = file
    this.errFile = errFiles && errFiles[0]
    const { Upload, $timeout } = this
    if (file) {
      file.upload = Upload.upload({
        url: 'tmp/',
        data: {
          file: file,
        },
      })

      file.upload.then((response) => {
        $timeout(() => {
          file.result = response.data
        })
      }, (response) => {
        if (response.status > 0) {
          this.errorMsg = `${response.status}: ${response.data}`
        }
      }, (evt) => {
        file.progress = Math.min(100, parseInt(100.0 *
                                   (evt.loaded / evt.total), 10))
      }).then(() => {
        Upload.base64DataUrl(file).then((url) => {
          this.student.image.src = url
        })
      })
    }
  }

  save() {
    this.student.yearLevel = parseInt(this.student.yearLevel, 10)
    try {
      schema.validate(this.student.doc)
      const { firstName, lastName } = this.student
      this.student.save(() => {
        this.student = new Student
      })
      this.ngToast.create({
        dismissButton: true,
        className: 'success',
        content: `${firstName} ${lastName} is ${this.message}!`,
      })
    } catch (e) {
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: `${e.reason}`,
      })
    }
    this.$state.go('app.student.view', { studentId: this.student._id })
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
      const student = Student.findOne({ idNumber: this.student.idNumber })
      if (student) {
        return true
      }
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
