/* eslint no-alert: "off" */
/* eslint-disable no-param-reassign */
import Student from '/imports/both/models/Student'
import XLSX from 'xlsx'
import { Component, State, Inject } from 'angular2-now'
import 'ng-file-upload/dist/ng-file-upload.min.js'
import '../views/student-upsert.html'

@State({
  name: 'app.student.upload',
  url: '/students/upload',
})
@Component({
  selector: 'mass-upload',
  templateUrl: 'imports/client/views/student-upsert.html',
})
@Inject('$scope', '$reactive', 'Upload', '$timeout')
class StudentMassUploadComponent {

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
          const workSheetClone = Object.assign({}, workSheet)
          const keys = Object.keys(workSheetClone)
          const headerRow = 7 // where the header starts
          const column = keys.filter((key) => {
            const pattern = new RegExp(`^[a-zA-Z]${headerRow}`)
            return pattern.test(key)
          }).map((row) => {
            return row.replace(/[^[a-zA-Z]]/g, '')
          })
          const maxColumn = column.reduce((memo, curr) => {
            const firstASCII = memo.charCodeAt(0)
            const secondASCII = curr.charCodeAt(0)
            const greaterASCII = Math.max(firstASCII, secondASCII)
            return String.fromCharCode(greaterASCII)
          })
          const minColumn = column.reduce((memo, curr) => {
            const firstASCII = memo.charCodeAt(0)
            const secondASCII = curr.charCodeAt(0)
            const greaterASCII = Math.min(firstASCII, secondASCII)
            return String.fromCharCode(greaterASCII)
          })
          const firstColumn = keys.filter((row) => {
            return row.startsWith(minColumn)
          })
          const maxRow = firstColumn.map((row) => {
            return row.replace(/[^0-9]/g, '')
          }).reduce((memo, current) => {
            return Math.max(memo, current)
          }, 0)
          const json = XLSX.utils.sheet_to_json(workSheet, { range: `${minColumn}${headerRow}:${maxColumn}${maxRow}` });
          this.students = json.map((student) => {
            const course = student.COURSE
            const idNumber = student['ID. NO.']
            const names = student.NAME.split(',')
            const degree = course.replace(/[^a-zA-Z]/g, '')
            const yearLevel = course.replace(/[^0-9]/g, '')
            const lastName = names[0]
            const middleName = names[1].split(' ').pop()
            const firstName = names[1].replace(middleName, '').trim()
            const nameSuffix = names[2] || ''
            const sex = student.SEX

            return new Student({
              degree: degree,
              yearLevel: yearLevel,
              lastName: lastName,
              firstName: firstName,
              middleName: middleName,
              nameSuffix: nameSuffix,
              idNumber: idNumber,
              gender: sex,
            })
          })
          console.log(this.students);
        })
      })
    }
  }

  save() {
    if (this.file) {
      this.students.forEach((student) => {
        student.save((err) => {
          if (err) {
            console.log(err);
          }
        })
      })
    } else {
      alert('Wala file')
    }
  }

}

export default StudentMassUploadComponent
