import Student from '/imports/both/models/Student'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import angular from 'angular'
import XLSX from 'xlsx'
import _ from 'underscore'
import '../views/student-list.html'

@State({
  name: 'app.student.list',
  url: '/students/list',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('secretary')
      return isAuthorized || $location.path('/login')
    },
  },
})
@Component({
  selector: 'student-list',
  templateUrl: 'imports/client/views/student-list.html',
})
@Inject('$scope', '$reactive', '$location', '$http')
class StudentListComponent {

  constructor($scope, $reactive, $location, $http) {
    $reactive(this).attach($scope)
    this.isReady = false
    this.helpers({
      students() {
        this.limit = this.limit || 20
        const studentsSub = this.subscribe('students-basic-infos', () => {
          return [this.getReactively('this.limit'), this.getReactively('this.searchText')]
        })
        const subs = [studentsSub]
        const subsReady = subs.every(sub => sub.ready())
        if (subsReady) {
          this.isReady = true
        }
        return Student.find().fetch()
      },
    })
    this.$http = $http
    this.$location = $location
    this.max = this.students.length
    this.url = this.url || window.location.href
    this.fileName = this.fileName || 'Download.xlsx'
    // setInterval(() => {
    //   console.log(this.filteredStudents);
    // }, 1000)
  }

  increaseLimit() {
    this.limit += 10
  }

  print() {
    const json = this.filteredStudents.map((entry) => {
      const properFormat = angular.copy(entry)
      const student = new Student(properFormat)
      const { doc } = student
      return _(doc).omit('image')
    })
    const sheet = XLSX.utils.json_to_sheet(json)
    //
    // const html = XLSX.utils.sheet_to_html(sheet)
    // this.content = html
    //
    const workbook = {
      SheetNames: [],
      Sheets: {
      },
    }
    const sheetName = 'Students List'
    workbook.SheetNames.push(sheetName)
    workbook.Sheets[sheetName] = sheet
    const wopts = {
      bookType: 'xlsx',
      bookSST: false,
      type: 'base64',
    }
    const base64URL = XLSX.write(workbook, wopts);
    const dataType = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64'
    const url = `${dataType},${base64URL}`
    this.fileName = `${sheetName}.${wopts.bookType}`
    this.url = url
  }

  get isStudentsReady() {
    return this.students.length > 0
  }

  view(student) {
    this.student = student
  }

}

export default StudentListComponent
