import Degree from '/imports/both/models/Degree'
import Department from '/imports/both/models/Department'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/degree-upsert.html'

@State({
  name: 'app.degree.create',
  url: '/degree/create',
  resolve: {
    redirect($location) {
      const user = Meteor.user()
      return user.hasARole('dean') || $location.path('/login')
    },
  },
})
@Component({
  selector: 'degree-upsert',
  templateUrl: 'imports/client/views/degree-upsert.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class DegreeUpsertComponent {

  constructor($scope, $reactive, $state, $stateParams) {
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
      degrees() {
        return Degree.find().fetch()
      },
      departments() {
        return Department.find().fetch()
      },
    })
  }

  save() {
    // TODO: to be change
    // this.degree.save(() => {
    //   alert('Added!')
    // })
    const degreeId = new Degree({ name: this.degree }).save((err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log(doc);
      }
    })
    new Department({ name: this.department, _id: degreeId }).save((err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log(doc);
      }
    })
  }

}

export default DegreeUpsertComponent
