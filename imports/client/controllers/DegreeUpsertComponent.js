/* eslint-disable no-alert */
import Degree from '/imports/both/models/Degree'
import { Component, State, Inject } from 'angular2-now'
import '../views/degree-upsert.html'

@State({
  name: 'app.degree.create',
  url: '/degree/create',
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
    this.subscribe('degrees')
    this.helpers({
      degree() {
        if ($state.current.name.endsWith('create')) {
          return new Degree
        }
        return Degree.findOne({ _id: degreeId })
      },
    })
  }

  save() {
    this.degree.save(() => {
      alert('Added!')
    })
  }
}
export default DegreeUpsertComponent
