/* eslint no-alert: "off" */
/* eslint-disable no-param-reassign */

import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import _ from 'underscore'
import XLSX from 'xlsx'
import Course from '/imports/both/models/Course'
import User from '/imports/both/models/User'
import 'ng-file-upload/dist/ng-file-upload.min.js'
import '../views/course-upload.html'

@State({
  name: 'app.course.upload',
  url: '/course/upload',
  resolve: {
    subs() {
      return new Promise((resolve) => {
        Tracker.autorun(() => {
          const courses = Meteor.subscribe('courses')
          const teachers = Meteor.subscribe('teachers')
          const subs = [courses, teachers]
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
      })
      .then(() => {
        Upload.base64DataUrl(file).then((url) => {
          const base64URL = url.split(',')[1]
          return base64URL
        })
        .then((base64URL) => {
          const workbook = XLSX.read(base64URL, { range: 2, raw: true, type: 'base64' })
          const firstSheetName = workbook.SheetNames[0]
          const workSheet = workbook.Sheets[firstSheetName]
          const json = XLSX.utils.sheet_to_json(workSheet, { range: 3, raw: true });
          const properObjects = json.filter((object) => {
            return Object.keys(object).length > 5
          })
          // TODO: Make this a getter later
          const columns = properObjects.map((course) => {
            return Object.keys(course)
          })
          const columnPatterns = _(columns).flatten()
          const columnPattern = _(columnPatterns).uniq()
          // columns followed as provided by dean
          const presetColumns = [
            'Stub No.',
            'Course No. & Description',
            'Time',
            'Day',
            'Room',
            'Teacher',
            'No. Of Units',
            'No. Of Students',
          ]
          const isValidExcel = columnPattern.every((column) => {
            return presetColumns.includes(column)
          })
          const isValid = (columns.length > 0) && isValidExcel
          if (!isValid) {
            this.file = undefined
            throw new Error('Excel is different from specified format.')
          }
          // to here
          const lectures = properObjects.filter((course) => {
            const { type, units } = this.getCourseObj(course)
            return type === 'LEC' && units !== '-'
          })
          const lecturesDashed = properObjects.filter((course) => {
            const { type, units } = this.getCourseObj(course)
            return type === 'LEC' && units === '-'
          }) // lectures with dashed units
          const labs = properObjects.filter((course) => {
            const { type } = this.getCourseObj(course)
            return type === 'LAB'
          })
          this.collections = { labs, lectures, lecturesDashed }
        })
        .catch((e) => {
          alert(e)
        })
      })
    }
  }

  getCourseObj(course) {
    const courseNumber = course['Course No. & Description']
    const room = course.Room.trim()
    const day = course.Day.trim()
    const time = course.Time.trim()
    const teacher = course.Teacher.trim()
    const courseObject = {
      courseNumber: courseNumber.split('-').shift().trim(),
      type: courseNumber.split('-').pop().trim(),
      units: course['No. Of Units'],
      stubcode: course['Stub No.'],
      room: room,
      time: `${time} ${day}`,
      teacher: teacher,
    }
    return courseObject
  }

  save() { // eslint-disable-line
    if (this.file) {
      const { lectures } = this.collections
      const lecStubs = lectures.map((lecture) => {
        const { stubcode } = this.getCourseObj(lecture)
        return stubcode
      })
      const population = _(lecStubs).uniq().length
      const courses = Course.find({ stubcode: { $in: lecStubs } }).fetch()
      if (population === courses.length) {
        return alert('Courses already exists')
      }
      new Promise((resolve, reject) => {
        if (population === courses.length) {
          reject('already exists')
        }
        resolve(lectures.forEach((lecture) => {
          const { stubcode } = this.getCourseObj(lecture)
          const courseObject = this.getCourseObj(lecture)
          const {
            courseNumber,
            units,
            room,
            time,
            teacher,
          } = courseObject
          const lastName = teacher.split(',').shift().trim()
          const teacherObject = User.findOne({ lastName: lastName })
          const course = new Course({
            stubcode: stubcode,
            subject: {
              courseNumber: courseNumber,
              units: units,
            },
            lecture: {
              instructor: teacherObject,
              room: room,
              time: time,
            },
          })
          course.save()
        }))
      })
      .then(() => {
        const { lecturesDashed } = this.collections
        lecturesDashed.forEach((lecture) => {
          const { time, stubcode } = this.getCourseObj(lecture)
          const course = Course.findOne({ stubcode: stubcode })
          if (time !== course.lecture.time) {
            course.lecture.time += ` | ${time}`
          }
        })
      })
      .then(() => {
        const { labs } = this.collections
        labs.forEach((lab) => {
          const laboratory = this.getCourseObj(lab)
          const {
            stubcode,
            teacher,
            room,
            time,
          } = laboratory
          const lastName = teacher.split(',').shift().trim()
          const teacherObject = User.findOne({ lastName: lastName })
          const subject = Course.findOne({ stubcode: stubcode })
          const course = {
            laboratory: {
              instructor: teacherObject,
              room: room,
              time: time,
            },
          }
          Object.assign(subject, course)
          subject.save()
        })
      })
      .then(() => {
        alert(`${population} courses added to database`)
      })
      .then(() => {
        this.file = undefined
      })
    } else {
      alert('No file Uploaded')
    }
  }
}

export default CourseUploadComponent
