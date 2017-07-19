/* eslint-disable no-alert */
import Subject from '/imports/both/models/Subject'
import schema from '/imports/both/schemas/Subject'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/subject-upsert.html'

@State({
  name: 'app.subject.create',
  url: '/subjects/create',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('secretary')
      return isAuthorized || $location.path('/login')
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
@Inject('$scope', '$reactive', '$state', '$stateParams', 'ngToast')
class SubjectUpsertComponent {
  static schema = schema
  constructor($scope, $reactive, $state, $stateParams, ngToast) {
    $reactive(this).attach($scope)
    const { subjectId } = $stateParams
    this.subscribe('subjects')
    this.hasLaboratory = false;
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
    this.ngToast = ngToast
  }
  remove(id) {
    Subject.remove(id)
  }

  save() {
    this.subject.credits = parseInt(this.subject.credits, 10)
    this.subject.units = parseInt(this.subject.units, 10)
    const subject = this.subject
    if (!this.hasLaboratory) {
      delete subject.laboratoryType
    }
    try {
      schema.validate(this.subject.doc)
      this.subject.save((doc, err) => {
        if (!err === undefined) {
          this.ngToast.create({
            dismissButton: true,
            className: 'danger',
            content: `${err.reason}`,
          })
        }
        // console.log(doc);
      })
      this.ngToast.create({
        dismissButton: true,
        className: 'success',
        content: `Subject ${this.message}!`,
      })
      this.subject = new Subject
    } catch (e) {
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: `${e.reason}`,
      })
    }
  }

}

export default SubjectUpsertComponent
