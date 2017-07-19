/* eslint no-alert: "off" */
/* eslint-disable no-param-reassign */
import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import XLSX from 'xlsx'
import 'ng-file-upload/dist/ng-file-upload.min.js'
import '../views/classroll-upload.html'

@State({
  name: 'app.classroll.upload',
  url: '/classroll/upload',
  resolve: {
    subs() {
      return new Promise((resolve) => {
        Tracker.autorun(() => {
          const students = Meteor.subscribe('students-basic-infos')
          const courses = Meteor.subscribe('courses')
          const subs = [courses, students]
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
  selector: 'classroll-upload',
  templateUrl: 'imports/client/views/classroll-upload.html',
})
@Inject('$scope', '$reactive', 'Upload', '$timeout')
class ClassRollUploadComponent {

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
          const workbook = XLSX.read(base64URL, { range: 2, raw: true, type: 'base64' })
          const firstSheetName = workbook.SheetNames[0]
          const workSheet = workbook.Sheets[firstSheetName]
          const json = XLSX.utils.sheet_to_json(workSheet, { range: 7, raw: true });
          const stubcode = parseInt(workSheet.R3.v, 10)
          const studentIdNumbers = json.map(student => student['ID. No.'])
          this.course = Course.findOne({ stubcode: stubcode })
          this.students = Student.find({ idNumber: { $in: studentIdNumbers } }).fetch()
          console.log(this.course);
          console.log(this.students);
        })
      })
    }
  }

  save() {
    if (this.file) {
      new Promise((resolve) => {
        resolve(this.students.forEach((student) => {
          this.course.enrollAStudent(student)
        }))
      })
      .then(() => {
        this.course.save(() => {
          const { length } = this.students
          const { stubcode } = this.course
          alert(`Enrolled ${length} to stubcode ${stubcode}`)
        })
      })
    }
  }

}

export default ClassRollUploadComponent
