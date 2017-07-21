/* eslint no-alert: "off" */
/* eslint-disable no-param-reassign */
import Student from '/imports/both/models/Student'
import schema from '/imports/both/schemas/Student'
import Degree from '/imports/both/models/Degree'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
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
    subs($stateParams) {
      return new Promise((resolve) => {
        Tracker.autorun(() => {
          const { studentId } = $stateParams
          const student = Meteor.subscribe('student', studentId)
          const degrees = Meteor.subscribe('degrees')
          const subs = [student, degrees]
          const isReady = subs.every(sub => sub.ready())
          if (isReady) {
            resolve(true)
          }
        })
      })
    },
  },
})
@State({
  name: 'app.student.edit',
  url: '/students/edit/:studentId',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('secretary')
      return isAuthorized || $location.path('/login')
    },
    subs($stateParams) {
      return new Promise((resolve) => {
        Tracker.autorun(() => {
          const { studentId } = $stateParams
          const student = Meteor.subscribe('student', studentId)
          const degrees = Meteor.subscribe('degrees')
          const subs = [student, degrees]
          const isReady = subs.every(sub => sub.ready())
          if (isReady) {
            resolve(true)
          }
        })
      })
    },
  },
})
@Component({
  selector: 'student-upsert',
  templateUrl: 'imports/client/views/student-upsert.html',
})
@Inject('$scope', '$reactive', '$state', 'ngToast', 'Upload', '$timeout')
class StudentUpsertComponent {
  static schema = schema
  constructor($scope, $reactive, $state, ngToast, Upload, $timeout) {
    $reactive(this).attach($scope)
    this.buttonLabel = ''
    this.message = ''
    this.Upload = Upload
    this.$timeout = $timeout
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
          return new Student()
        }
        return Student.findOne()
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

  get defaultPicture() {
    const gender = {
      Male: '/defaults/default_male.png',
      Female: '/defaults/default_female.png',
    }
    const isFemale = this.student.gender === 'Female'
    const hasNoPicture = !(this.student.image.src)
    let displayImage = (hasNoPicture && isFemale) ? gender.Female : gender.Male
    displayImage = this.student.image.src || displayImage
    return displayImage
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
          this.displayImage = url
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
      schema.pick('idNumber').validate({ idNumber: this.student.idNumber })
      if (student) {
        return true
      }
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
