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
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('dean') || $state.go('app.login')
    },
  },


})
@Component({
  selector: 'dept-upsert',
  templateUrl: 'imports/client/views/department-upsert.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', 'ng-toast')
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
