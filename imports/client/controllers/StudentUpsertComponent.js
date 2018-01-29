/* eslint no-alert: "off" */
/* eslint-disable no-param-reassign */
import Student from '/imports/both/models/Student'
import schema from '/imports/both/schemas/Student'
import Degree from '/imports/both/models/Degree'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Component, State, Inject } from 'angular2-now'
import _ from 'underscore'
import 'ng-file-upload/dist/ng-file-upload.min.js'
import '../views/student-upsert.html'
import '../styles/studentUpsert.scss'

@State({
  name: 'app.student.create',
  url: '/students/create',
  resolve: {
    redirect: ['$location', ($location) => {
      const isAuthorized = Meteor.user() && Meteor.user().hasARole('secretary')
      return isAuthorized || $location.path('/login')
    }],
  },
})
@State({
  name: 'app.student.edit',
  url: '/students/edit/:studentId',
  resolve: {
    redirect: ['$location', ($location) => {
      const isAuthorized = Meteor.user() && Meteor.user().hasARole('secretary')
      return isAuthorized || $location.path('/login')
    }],
  },
})
@Component({
  selector: 'student-upsert',
  templateUrl: 'imports/client/views/student-upsert.html',
})
@Inject('$scope', '$reactive', '$state', 'ngToast', 'Upload', '$timeout', '$stateParams')
class StudentUpsertComponent {
  static schema = schema
  constructor($scope, $reactive, $state, ngToast, Upload, $timeout, $stateParams) {
    $reactive(this).attach($scope)
    this.isReady = false
    this.buttonLabel = ''
    this.message = ''
    this.Upload = Upload
    this.studentContext = schema.namedContext()
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
        const degrees = this.subscribe('degrees')
        if ($state.current.name.endsWith('create')) {
          const subs = [degrees]
          const isReady = subs.every(sub => sub.ready())
          if (isReady) {
            this.isReady = true
          }
          return new Student()
        }
        const { studentId } = $stateParams
        const student = this.subscribe('student', () => {
          return [studentId]
        })
        const subs = [student, degrees]
        const isReady = subs.every(sub => sub.ready())
        if (isReady) {
          this.isReady = true
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
    let displayImage = gender[this.student.gender || 'Male']
    if (this.student.image) {
      displayImage = this.student.image.src || displayImage
    }
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
          this.student.image = this.student.image || {}
          this.student.image.src = url
          this.displayImage = url
        })
      })
    }
  }

  save() {
    this.student.yearLevel = parseInt(this.student.yearLevel, 10)
    this.validateStudent()
    try {
      schema.validate(this.student.doc)
      const { firstName, lastName } = this.student
      const studentId = this.student.save(() => {
        this.$state.go('app.student.view', { studentId: studentId })
        this.student = new Student
      })
      this.ngToast.create({
        dismissButton: true,
        className: 'success',
        content: `${firstName} ${lastName} is ${this.message}!`,
      })
      this.$state.go('app.student.view', { studentId: this.student._id })
    } catch (e) {
      this.errorMessages = ''
      _.map(this.studentContext.invalidKeys(), (key) => {
        this.errorMessages += this.studentContext.keyErrorMessage(key.name)
        this.errorMessages += '</br>'
      })
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: this.errorMessages,
      })
    }
  }

  validateStudent() {
    this.validateFirstName()
    this.validateLastName()
    this.validateIdNumber()
    // this.validateBirthday()
    this.validateMiddleName()
    this.validateEmail()
    this.validateReligion()
    this.validateHomeAddress()
    this.validateCityAddress()
    this.validateContactNumber()
    this.validateCitizenship()
  }

  validateFirstName() {
    if (this.studentContext.validateOne(this.student.doc, 'firstName')) {
      this.isInvalidFirstName = false
    } else {
      this.isInvalidFirstName = true
      this.firstNameErrorMessage = this.studentContext.keyErrorMessage('firstName')
    }
  }

  validateLastName() {
    if (this.studentContext.validateOne(this.student.doc, 'lastName')) {
      this.isInvalidLastName = false
    } else {
      this.isInvalidLastName = true
      this.lastNameErrorMessage = this.studentContext.keyErrorMessage('lastName')
    }
  }

  validateIdNumber() {
    // console.log(this.studentContext.validateOne(this.student.doc, 'idNumber'));
    if (this.studentContext.validateOne(this.student.doc, 'idNumber')) {
      this.isInvalidIdNumber = false
    } else {
      this.isInvalidIdNumber = true
      this.idNumberErrorMessage = this.studentContext.keyErrorMessage('idNumber')
    }
  }

  validateMiddleName() {
    if (this.studentContext.validateOne(this.student.doc, 'middleName')) {
      this.isInvalidMiddleName = false
    } else {
      this.isInvalidMiddleName = true
      this.middleNameErrorMessage = this.studentContext.keyErrorMessage('middleName')
    }
    // try {
    //   schema.pick('middleName').validate({ middleName: this.student.middleName })
    //   return false
    // } catch (e) {
    //   this.middleNameErrorMessage = e.reason
    //   return true
    // }
  }

  validateBirthday() {
    if (this.studentContext.validateOne(this.student.doc, 'birthday')) {
      this.isInvalidBirthday = false
    } else {
      this.isInvalidBirthday = true
      this.birthdayErrorMessage = this.studentContext.keyErrorMessage('birthday')
    }
    // try {
    //   schema.pick('birthday').validate({ birthday: this.student.birthday })
    //   return false
    // } catch (e) {
    //   this.birthdayErrorMessage = e.reason
    //   return true
    // }
  }

  validateHomeAddress() {
    if (this.studentContext.validateOne(this.student.doc, 'homeAddress')) {
      this.isInvalidHomeAddress = false
    } else {
      this.isInvalidHomeAddress = true
      this.homeAddressErrorMessage = this.studentContext.keyErrorMessage('homeAddress')
    }
  }

  validateCityAddress() {
    if (this.studentContext.validateOne(this.student.doc, 'cityAddress')) {
      this.isInvalidCityAddress = false
    } else {
      this.isInvalidCityAddress = true
      this.cityAddressErrorMessage = this.studentContext.keyErrorMessage('cityAddress')
    }
    // try {
    //   schema.pick('cityAddress').validate({ cityAddress: this.student.cityAddress })
    //   return false
    // } catch (e) {
    //   this.cityAddressErrorMessage = e.reason
    //   return true
    // }
  }

  validateContactNumber() {
    if (this.studentContext.validateOne(this.student.doc, 'contactNumber')) {
      this.isInvalidContactNumber = false
    } else {
      this.isInvalidContactNumber = true
      this.contactNumberErrorMessage = this.studentContext.keyErrorMessage('contactNumber')
    }
    // try {
    //   schema.pick('contactNumber').validate({ contactNumber: this.student.contactNumber })
    //   return false
    // } catch (e) {
    //   this.contactNumberErrorMessage = e.reason
    //   return true
    // }
  }

  validateReligion() {
    if (this.studentContext.validateOne(this.student.doc, 'religion')) {
      this.isInvalidReligion = false
    } else {
      this.isInvalidReligion = true
      this.religionErrorMessage = this.studentContext.keyErrorMessage('religion')
    }
    // try {
    //   schema.pick('religion').validate({ religion: this.student.religion })
    //   return false
    // } catch (e) {
    //   this.religionErrorMessage = e.reason
    //   return true
    // }
  }

  validateCitizenship() {
    if (this.studentContext.validateOne(this.student.doc, 'citizenship')) {
      this.isInvalidCitizenship = false
    } else {
      this.isInvalidCitizenship = true
      this.citizenshipErrorMessage = this.studentContext.keyErrorMessage('citizenship')
    }
    // try {
    //   schema.pick('citizenship').validate({ citizenship: this.student.citizenship })
    //   return false
    // } catch (e) {
    //   this.citizenshipErrorMessage = e.reason
    //   return true
    // }
  }

  validateEmail() {
    if (this.studentContext.validateOne(this.student.doc, 'email')) {
      this.isInvalidEmail = false
    } else {
      this.isInvalidEmail = true
      this.emailErrorMessage = this.studentContext.keyErrorMessage('email')
    }
    // try {
    //   schema.pick('email').validate({ email: this.student.email })
    //   return false
    // } catch (e) {
    //   if (e.reason.includes('regular expression')) {
    //     this.emailErrorMessage = 'Invalid email address'
    //   } else {
    //     this.emailErrorMessage = e.reason
    //   }
    //   return true
    // }
  }

  validateFathersName() {
    // if (this.studentContext.validateOne(this.student.doc, 'contactNumber')) {
    //   this.isInvalidContactNumber = false
    // } else {
    //   this.isInvalidContactNumber = true
    //   this.contactNumberErrorMessage = this.studentContext.keyErrorMessage('contactNumber')
    // }
    try {
      schema.pick('father.fullName').validate({ 'father.fullName': this.student.father.fullName })
      return false
    } catch (e) {
      this.fathersNameErrorMessage = e.reason
      return true
    }
  }
  openPicker() {
    this.popup.opened = true
  }
}

export default StudentUpsertComponent
