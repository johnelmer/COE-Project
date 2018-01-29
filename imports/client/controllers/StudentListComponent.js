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
    redirect: ['$location', ($location) => {
      const isAuthorized = Meteor.user() && Meteor.user().hasARole('secretary')
      return isAuthorized || $location.path('/login')
    }],
  },
})
@Component({
  selector: 'student-list',
  templateUrl: 'imports/client/views/student-list.html',
})
@Inject('$scope', '$reactive', '$location', '$http', '$filter', '$state', 'uiGridConstants')
class StudentListComponent {

  constructor($scope, $reactive, $location, $http, $filter, $state, uiGridConstants) {
    $reactive(this).attach($scope)
    this.isReady = false
    this.filter = $filter('filter')
    this.gridOptions = this.gridOptions || {}
    this.helpers({
      students() {
        this.searchText = this.searchText || ''
        const studentsSub = this.subscribe('students-basic-infos')
        const subs = [studentsSub]
        this.isReady = subs.every(sub => sub.ready())
        let students
        if (this.isReady) {
          students = Student.find().fetch()
          this.degrees = students.map(student => student.degree)
                      .filter((degree, index, degrees) => {
                        return index === degrees.indexOf(degree)
                      })
          this.degreeOptions = this.degrees.map((degree) => {
            const obj = {
              value: degree,
              label: degree,
            }
            return obj
          })
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
    this.autorun(() => {
      const gridOptions = {
        enableGridMenu: true,
        exporterMenuCsv: false,
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 500,
        enableSorting: true,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableSelectAll: true,
        enableFiltering: false,
        onRegisterApi: (gridApi) => {
          this.gridApi = gridApi
        },
      //   rowTemplate: '<div ng-mouseover="rowStyle={\'background-color\': \'red\'}; grid.appScope.onRowHover(this);" ng-mouseleave="rowStyle={}">' +
      // '<div  ng-style="rowStyle" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" ui-grid-one-bind-id-grid="rowRenderIndex + \'-\' + col.uid + \'-cell\'"' +
      // 'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" role="{{col.isRowHeader ? \'rowheader\' : \'gridcell\'}}" ui-grid-cell ui-sref="app.student.view({ studentId: row.entity._id })" >' +
      // '</div> </div>',
        columnDefs: [
          {
            field: 'idNumber',
            displayName: 'ID Number',
            minWidth: 120,
            filter: {
              condition: uiGridConstants.filter.CONTAINS,
              placeholder: 'Contains',
            },
          },
          {
            field: 'lastName',
            displayName: 'Last Name',
            minWidth: 120,
            cellTemplate: '<a class="ui-grid-cell-contents link" ui-sref="app.student.view({ studentId: row.entity._id })">{{grid.getCellValue(row, col)}}</a>',
            filter: {
              condition: uiGridConstants.filter.CONTAINS,
              placeholder: 'Contains',
            },
          },
          {
            field: 'firstName',
            displayName: 'First Name',
            minWidth: 120,
            cellTemplate: '<a class="ui-grid-cell-contents link" ui-sref="app.student.view({ studentId: row.entity._id })">{{grid.getCellValue(row, col)}}</a>',
            filter: {
              condition: uiGridConstants.filter.CONTAINS,
              placeholder: 'Contains',
            },
          },
          {
            field: 'gender',
            displayName: 'Gender',
            minWidth: 120,
            filter: {
              type: uiGridConstants.filter.SELECT,
              condition: uiGridConstants.filter.EXACT,
              selectOptions: [
                {
                  value: 'Male',
                  label: 'Male',
                },
                {
                  value: 'Female',
                  label: 'Female',
                },
              ],
            },
            // cellFilter: 'genderFilter',
          },
          {
            field: 'degree',
            displayName: 'Degree',
            minWidth: 120,
            filter: {
              type: uiGridConstants.filter.SELECT,
              selectOptions: this.getReactively('this.degreeOptions'),
            },
          },
          {
            field: 'yearLevel',
            displayName: 'Year Level',
            minWidth: 120,
            filters: [
              {
                condition: uiGridConstants.filter.LESS_THAN,
                placeholder: 'Less Than',
              },
              {
                condition: uiGridConstants.filter.GREATER_THAN,
                placeholder: 'Greater Than',
              },
            ],
          },
        ],
      }
      Object.assign(this.gridOptions, gridOptions)
    })
    // 'this' is different when inside gridOptions
    // had to separate
    // this.gridOptions.onRegisterApi = (gridApi) => {
    //   $scope.gridApi = gridApi
    // }
    this.uiGridConstants = uiGridConstants
    this.$state = $state
    this.$scope = $scope
  }

  toggleAdvancedFilter() {
    const { uiGridConstants, gridOptions } = this
    const { enableFiltering } = gridOptions
    this.gridOptions.enableFiltering = !enableFiltering
    this.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN)
  }

  gridRowClick(row) {
    console.log(row);
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

  get isStudentsReady() {
    return this.students.length > 0
  }

  view(student) {
    this.student = student
  }

}

export default StudentListComponent
