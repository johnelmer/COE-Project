import { Component, State, Inject } from 'angular2-now'
import User from '/imports/both/models/User'
import Subject from '/imports/both/models/Subject'
import 'ui-select/dist/select.css'
import '../views/subject-assign.html'

@State({
  name: 'app.subject.assign',
  url: '/subject/assign',
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
    this.subscribe('teachers')
    this.subscribe('subjects')
    this.subscribe('roles')
    this.people = [
      {
        name: 'Adam',
        email: 'adam@email.com',
        age: 12,
        country: 'United States',
      },
      {
        name: 'Amalie',
        email: 'amalie@email.com',
        age: 12,
        country: 'Argentina',
      },
      {
        name: 'Estefanía',
        email: 'estefania@email.com',
        age: 21,
        country: 'Argentina',
      },
      {
        name: 'Adrian',
        email: 'adrian@email.com',
        age: 21,
        country: 'Ecuador',
      },
      {
        name: 'Wladimir',
        email: 'wladimir@email.com',
        age: 30,
        country: 'Ecuador',
      },
    ]
    this.helpers({
      teachers() {
        return User.find().fetch()
      },
      subjects() {
        return Subject.find().fetch()
      },
    })
  }

}

export default SubjectAssignmentComponent
