/* eslint-disable no-alert */
import Department from '/imports/both/models/Department'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/department-upsert.html'

@State({
  name: 'app.department.create',
  url: '/department/create',
  resolve: {
    redirect($location, $meteor) {
      $meteor.subscribe('roles').then(() => {
        const user = Meteor.user()
        return user.hasARole('dean') || $location.path('/login')
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
    this.department.save(() => {
      this.ngToast.create({
        dismissButton: true,
        className: 'success',
        content: 'Department Add',
      })
    })
  }
}
export default DepartmentUpsertComponent
