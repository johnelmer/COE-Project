/* eslint-disable no-alert */
import Department from '/imports/both/models/Department'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/department-upsert.html'

@State({
  name: 'app.department.create',
  url: '/department/create',
  resolve: {
    redirect($location) {
      const user = Meteor.user()
      return user.hasARole('dean') || $location.path('/login')
    },
  },
})
@Component({
  selector: 'dept-upsert',
  templateUrl: 'imports/client/views/department-upsert.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class DepartmentUpsertComponent {

  constructor($scope, $reactive, $state, $stateParams) {
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
  }

  save() {
    this.department.save(() => {
      alert('Added!')
    })
  }
}

export default DepartmentUpsertComponent
