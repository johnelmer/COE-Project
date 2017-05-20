import { Component, State, Inject } from 'angular2-now'
import User from '/imports/both/models/User'
import Subject from '/imports/both/models/Subject'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import 'ui-select/dist/select.css'
import '../views/subject-assign.html'

@State({
  name: 'app.subject.assign',
  url: '/subject/assign',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('department head') || $state.go('app.login')
    },
  },
})
@Component({
  selector: 'subject-assign',
  templateUrl: 'imports/client/views/subject-assign.html',
})
@Inject('$scope', '$reactive', '$state')
class SubjectAssignmentComponent {

  constructor($scope, $reactive, $state) {
    $reactive(this).attach($scope)
    this.$state = $state
    this.subscribe('users')
    this.subscribe('subjects')
    this.subscribe('roles')
    this.helpers({
      teachers() {
        return User.find({ roleName: 'faculty' }).fetch()
      },
      subjects() {
        return Subject.find().fetch()
      },
    })
  }

  save() {
    // NOTE: to be change
    this.subject.save((doc, err) => {
      if (err) {
        console.log(err);
      }
      this.subject = new Subject
      console.log(doc);
    })
  }

}

export default SubjectAssignmentComponent
