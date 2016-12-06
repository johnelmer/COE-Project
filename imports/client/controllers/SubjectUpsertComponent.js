/* eslint-disable no-alert */
import Subject from '/imports/both/models/Subject'

import { Component, State, Inject } from 'angular2-now'
import '../views/subject-upsert.html'

@State({
  name: 'app.subject.create',
  url: '/subjects/create',
})
@State({
  name: 'app.subject.edit',
  url: '/subjects/edit/:subjectId',
})
@Component({
  selector: 'subject-upsert',
  templateUrl: 'imports/client/views/subject-upsert.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class SubjectUpsertComponent {

  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    const { subjectId } = $stateParams
    if ($state.current.name.endsWith('create')) {
      this.buttonLabel = 'Add'
      this.message = 'added'
    } else {
      this.buttonLabel = 'Update'
      this.message = 'updated'
    }
    this.helpers({
      subject() {
        if ($state.current.name.endsWith('create')) {
          return new Subject
        }
        return Subject.findOne(subjectId)
      },
    })
  }

  save() {
    this.subject.save(() => {
      alert(`Subject ${this.message}!`)
    })
  }

}

export default SubjectUpsertComponent
