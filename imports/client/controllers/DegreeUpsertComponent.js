import Degree from '/imports/both/models/Degree'
import Department from '/imports/both/models/Department'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import 'ng-toast/dist/ngToast.css'
import '../views/degree-upsert.html'

@State({
  name: 'app.degree.create',
  url: '/degree/create',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('dean')
      return isAuthorized || $location.path('/login')
    },
  },
})
@Component({
  selector: 'degree-upsert',
  templateUrl: 'imports/client/views/degree-upsert.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams', 'ngToast')
class DegreeUpsertComponent {

  constructor($scope, $reactive, $state, $stateParams, ngToast) {
    $reactive(this).attach($scope)
    const { degreeId } = $stateParams
    this.degree = ''
    this.department = ''
    this.subscribe('degrees')
    this.subscribe('departments')
    this.helpers({
      degree() {
        if ($state.current.name.endsWith('create')) {
          return new Degree
        }
        return Degree.findOne({ _id: degreeId })
      },
      department() {
        if ($state.current.name.endsWith('create')) {
          return new Department
        }
        return Department.findOne({ _id: degreeId })
      },
      departments() {
        return Department.find().fetch()
      },
    })
    this.ngToast = ngToast
  }

  remove(dept) {
    Department.remove({ _id: dept._id }, (err) => {
      if (!err) { Degree.remove({ _id: dept.degreeId }) }
    })
  }

  save() {
    new Degree({ name: this.degreeName }).save((err, doc) => {
      if (err) {
        this.ngToast.create({
          dismissButton: true,
          className: 'danger',
          content: `${err.reason}`,
        })
      } else {
        new Department({ name: this.departmentName, degreeId: doc }).save((error, doc) => {
          if (error) {
            this.ngToast.create({
              dismissButton: true,
              className: 'danger',
              content: `${err.reason}`,
            })
          }
        })
      }
      this.degreeName = ''
      this.departmentName = ''
    })
    this.ngToast.create({
      dismissButton: true,
      className: 'success',
      content: 'Department & Degree Created!',
    })
  }

}

export default DegreeUpsertComponent
