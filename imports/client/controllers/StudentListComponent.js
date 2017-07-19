import Student from '/imports/both/models/Student'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Component, State, Inject } from 'angular2-now'
import '../views/student-list.html'

@State({
  name: 'app.student.list',
  url: '/students/list',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('secretary')
      return isAuthorized || $location.path('/login')
    },
    subsReady() {
      return new Promise((resolve) => {
        Tracker.autorun(() => {
          const studentsSub = Meteor.subscribe('students')
          const subs = [studentsSub]
          const subsReady = subs.every(sub => sub.ready())
          if (subsReady) {
            resolve(true)
          }
        })
      })
    },
  },
})
@Component({
  selector: 'student-list',
  templateUrl: 'imports/client/views/student-list.html',
})
@Inject('$scope', '$reactive', '$uibModal')
class StudentListComponent {

  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.helpers({
      students() {
        return Student.find().fetch()
      },
    })
  }

  get isStudentsReady() {
    return this.students.length > 0
  }

  view(student) {
    this.student = student
  }

}

export default StudentListComponent
