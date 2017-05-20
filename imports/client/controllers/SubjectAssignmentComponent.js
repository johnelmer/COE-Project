import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import User from '/imports/both/models/User'
import Subject from '/imports/both/models/Subject'
import Course from '/imports/both/models/Course'
import Role from '/imports/both/models/Role'
import 'ui-select/dist/select.css'
import '../views/subject-assign.html'

@State({
  name: 'app.subject.assign',
  url: '/subject/assign',
  resolve: {
    redirect($state) {
      const user = Meteor.user()
      const role = user.role
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
    this.subscribe('users')
    this.subscribe('courses')
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

  assignSubject() {
    // for departmenthead
    const teacherId = this.teacher._id
    const role = Meteor.user().role
    const canAssign = role.is('department head')
    if (canAssign) {
      this.subjectsAssigned.forEach((subject) => {
        const course = subject.getNewCourse({ lecture: { instructorId: teacherId } })
        subject.save()
        console.log(course);
        this.teacher.courseIds.push(course._id)
        this.teacher.save()
      })
    }
  }

  update() {
    // for secretary
  }


}

export default SubjectAssignmentComponent
