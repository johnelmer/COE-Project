/* eslint no-alert: "off" */
/* eslint-disable no-param-reassign */
import Student from '/imports/both/models/Student'
import XLSX from 'xlsx'
import schema from '/imports/both/schemas/Student'
import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import 'ng-file-upload/dist/ng-file-upload.min.js'
import '../views/mass-upload.html'

@State({
  name: 'app.student.upload',
  url: '/students/upload',
  redirect($location) {
    const isAuthorized = Meteor.user().hasARole('secretary')
    return isAuthorized || $location.path('/login')
  },
})
@Component({
  selector: 'mass-upload',
  templateUrl: 'imports/client/views/mass-upload.html',
})
@Inject('$scope', '$reactive', 'Upload', '$timeout')
class StudentMassUploadComponent {
  static schema = schema

  constructor($scope, $reactive, Upload, $timeout) {
    $reactive(this).attach($scope)
    this.Upload = Upload
    this.$timeout = $timeout
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
          const base64URL = url.split(',')[1]
          return base64URL
        }).then((base64URL) => {
          const workbook = XLSX.read(base64URL, { type: 'base64' })
          const firstSheetName = workbook.SheetNames[0]
          const workSheet = workbook.Sheets[firstSheetName]
          const json = XLSX.utils.sheet_to_json(workSheet, { raw: true });
          const cleanJson = json.filter((item) => {
            const keys = Object.keys(item)
            const isDirty = keys.find((key) => {
              return item[key] === 'NULL'
            })
            return !isDirty
          })
          const students = cleanJson.map((student) => {
            const {
              STIDNUM,
              SURNAME,
              GIVNAME,
              MIDDLENAME,
              COURSE,
              SEX,
              YEAR,
            } = student
            return new Student({
              degree: COURSE.trim(),
              yearLevel: YEAR,
              lastName: SURNAME.trim(),
              firstName: GIVNAME.trim(),
              middleName: MIDDLENAME.trim(),
              idNumber: STIDNUM.trim(),
              gender: SEX.trim(),
            })
          })
          return students
        }).then((students) => {
          console.log(students);
          this.students = students
        })
      })
    }
  }

  save() {
    if (this.file) {
      new Promise((resolve) => {
        resolve(this.students.forEach((student) => {
          schema.validate(student);
          student.save((err) => {
            if (err) {
              console.log(err);
            }
          })
        }))
      }).then(() => {
        alert(`${this.students.length} students uploaded.`)
      })
    } else {
      alert(`The file doesn't exist.`)
    }
  }

}

export default StudentMassUploadComponent
