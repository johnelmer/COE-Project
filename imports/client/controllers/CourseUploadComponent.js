/* eslint no-alert: "off" */
/* eslint-disable no-param-reassign */

import { Component, State, Inject } from 'angular2-now'
import XLSX from 'xlsx'
import 'ng-file-upload/dist/ng-file-upload.min.js'
import '../views/course-upload.html'

@State({
  name: 'app.course.upload',
  url: '/course/upload',
})
@Component({
  selector: 'course-upload',
  templateUrl: 'imports/client/views/course-upload.html',
})
@Inject('$scope', '$reactive', 'Upload', '$timeout')
class CourseUploadComponent {

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
          const json = XLSX.utils.sheet_to_json(workSheet, { range: 3, raw: true });
          const properObjects = json.filter((object) => {
            return Object.keys(object).length > 5
          })
          console.log(properObjects);
        })
      })
    }
  }

}

export default CourseUploadComponent
