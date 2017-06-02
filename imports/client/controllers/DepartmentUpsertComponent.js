/* eslint-disable no-alert */
import Department from '/imports/both/models/Department'
import schema from '/imports/both/schemas/Department'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/department-upsert.html'

@State({
  name: 'app.department.create',
  url: '/department/create',
  resolve: {
    redirect($auth, $location) {
      $auth.awaitUser().then((user) => {
        if (user.hasARole('dean')) {
          $location.path('/login')
        }
      })
    },
  },
})
@Component({
  selector: 'dept-upsert',
  templateUrl: 'imports/client/views/department-upsert.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', 'ngToast')
class DepartmentUpsertComponent {
  static schema = schema
  constructor($scope, $reactive, $state, $stateParams, ngToast) {
    $reactive(this).attach($scope)
    const { departmentId } = $stateParams
    this.subscribe('departments')
    this.helpers({
      department() {
        if ($state.current.name.endsWith('create')) {
          return new Department
        }
        return Department.findOne({ _id: departmentId })
      },
      departments() {
        return Department.find().fetch()
      },
    })
    this.ngToast = ngToast
  }

  save() {
    try {
      schema.validate(this.department.doc)
      this.department.save(() => {
        this.ngToast.create({
          dismissButton: true,
          className: 'success',
          content: 'Department Add',
        })
      })
    } catch (e) {
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: `${e.reason}`,
      })
    }
  }
}

export default DepartmentUpsertComponent
