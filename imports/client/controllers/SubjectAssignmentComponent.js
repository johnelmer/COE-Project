import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import User from '/imports/both/models/User'
import Subject from '/imports/both/models/Subject'
import Role from '/imports/both/models/Role'
import Course from '/imports/both/models/Course'

import 'ui-select/dist/select.css'
import '../views/subject-assign.html'

@State({
  name: 'app.subject.assign',
  url: '/subject/assign',
  resolve: {
    redirect($location, $meteor) {
      $meteor.subscribe('roles').then(() => {
        const user = Meteor.user()
        return user.hasARole('department head') || $location.path('/login')
      })
    },
  },
})
@Component({
  selector: 'subject-assign',
  templateUrl: 'imports/client/views/subject-assign.html',
})
@Inject('$scope', '$reactive')
class SubjectAssignmentComponent {

  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.subscribe('users')
    this.subscribe('courses')
    this.subscribe('subjects')
    this.subscribe('roles')
    this.subscribe('settings')
    this.helpers({
      teachers() {
        return User.find({ roleName: 'faculty' }).fetch()
      },
      subjects() {
        return Subject.find().fetch()
      },
      courses() {
        return Course.find().fetch()
      },
    })
  }

  assignSubject() {
    // for departmenthead, dean and secretary
    const teacherId = this.teacher._id
    const user = Meteor.user()
    const role = user.role
    const canAssign = role.hasARole('department head')
    if (canAssign) {
      this.subjectsAssigned.forEach((subject) => {
        const courseId = subject.getNewCourseId({ lecture: { instructorId: teacherId } })
        subject.save()
        console.log(courseId);
        this.teacher.addCourse(courseId)
        this.teacher.save((err, doc) => {
          console.log(err);
          console.log(doc);
        })
      })
    }
  }
}

export default SubjectAssignmentComponent
