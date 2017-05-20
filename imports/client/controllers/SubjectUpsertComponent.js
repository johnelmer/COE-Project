/* eslint-disable no-alert */
import Subject from '/imports/both/models/Subject'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/subject-upsert.html'

@State({
  name: 'app.subject.create',
  url: '/subjects/create',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('secretary') || $state.go('app.login')
    },
  },
})
@State({
  name: 'app.subject.edit',
  url: '/subjects/edit/:subjectId',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('secretary') || $state.go('app.login')
    },
  },
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
    this.subscribe('subjects')
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
      subjects() {
        return Subject.find().fetch()
      },
    })
  }
  save() {
    console.log(this.subject);
    this.subject.save((doc, err) => {
      console.log(doc);
      console.log(err);
      alert(`Subject ${this.message}!`)
    })
  }

}

export default SubjectUpsertComponent
