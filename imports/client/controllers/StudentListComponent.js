/* eslint-disable no-param-reassign */
import Student from '/imports/both/models/Student'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import angular from 'angular'
import XLSX from 'xlsx'
import 'angular-ui-grid/ui-grid.min.js'
import 'angular-ui-grid/ui-grid.min.css'
import 'pdfmake/build/pdfmake.min.js'
import 'pdfmake/build/vfs_fonts.js'
import '../views/student-list.html'
import '../styles/studentList.scss'

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
@Inject('$scope', '$reactive', '$location', '$http', '$filter')
class StudentListComponent {

  constructor($scope, $reactive, $location, $http, $filter) {
    $reactive(this).attach($scope)
    this.isReady = false
    this.filter = $filter('filter')
    this.helpers({
      students() {
        this.searchText = this.searchText || ''
        const studentsSub = this.subscribe('students-basic-infos')
        const subs = [studentsSub]
        const subsReady = subs.every(sub => sub.ready())
        let students
        if (subsReady) {
          this.isReady = true
          students = Student.find().fetch()
          this.max = students.length
          this.filteredStudents = this.filter(students, this.getReactively('this.searchText'))
          this.gridOptions.data = this.filteredStudents
        }
        return students
      },
    })
    this.$http = $http
    this.$location = $location
    this.buttonTemplate = "<button class='btn btn-primary btn-sm btn-block'"
    this.buttonTemplate += "ui-sref='app.student.view({ studentId: student._id })'"
    this.gridOptions = {
      enableGridMenu: true,
      exporterMenuCsv: false,
      exporterPdfOrientation: 'portrait',
      exporterPdfPageSize: 'LETTER',
      exporterPdfMaxGridWidth: 500,
      enableSorting: true,
      enablePinning: true,
      multiSelect: true,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      // enableSelectAll: true,
      columnDefs: [
        {
          field: 'idNumber',
          displayName: 'ID Number',
          minWidth: 120,
        },
        {
          field: 'lastName',
          displayName: 'Last Name',
          minWidth: 120,
        },
        {
          field: 'firstName',
          displayName: 'First Name',
          minWidth: 120,
        },
        {
          field: 'degree',
          displayName: 'Degree',
          minWidth: 120,
        },
        {
          field: 'yearLevel',
          displayName: 'Year Level',
          minWidth: 120,
        },
        // {
        //   name: 'Action'
        //   displayName: 'Actions',
        //   cellTem
        // },
      ],
    }
    // 'this' is different when inside gridOptions
    // had to separate
    this.gridOptions.onRegisterApi = (gridApi) => {
      this.gridApi = gridApi
    }
    $http.get('/data/100.json')
    .success((data) => {
      this.gridOptions.data = data;
    });
    this.url = this.url || window.location.href
    this.fileName = this.fileName || 'Download.xlsx'
  }

  selectAll() {
    this.gridApi.selection.selectAllRows()
  }

  clearAll() {
    this.gridApi.selection.clearSelectedRows()
  }

  increaseLimit() {
    this.limit += 10
  }

  print() {
    const json = this.filteredStudents.map((entry) => {
      const properFormat = angular.copy(entry)
      const student = new Student(properFormat)
      return student.doc
    })
    const sheet = XLSX.utils.json_to_sheet(json)
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
