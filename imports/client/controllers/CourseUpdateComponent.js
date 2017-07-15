import Course from '/imports/both/models/Course'
import Role from '/imports/both/models/Role'
import User from '/imports/both/models/User'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/course-update.html'

@State({
  name: 'app.course.assign.update',
  url: '/course/update/:courseId',
  resolve: {
    redirect(user, $location) {
      const isAuthorized = user.hasARole('faculty')
      return isAuthorized || $location.path('/login')
    },
  },
})
@Component({
  selector: 'courseData-update',
  templateUrl: 'imports/client/views/course-update.html',
})
@Inject('$scope', '$reactive', '$stateParams')
class CourseUpdateComponent {
  constructor($scope, $reactive, $stateParams) {
    $reactive(this).attach($scope)
    const { courseId } = $stateParams
    this.subscribe('courses')
    this.subscribe('users')
    this.helpers({
      course() {
        return Course.findOne({ _id: courseId })
      },
      teachers() {
        return User.find({ roleName: 'faculty' }).fetch()
      }
    })
  }

  save() {
    if (this.teacher !== undefined ) {
      const labTime = this.course.laboratory.time
      const labRoom = this.course.laboratory.room
      const labTeacher = this.teacher.fullName
      const labTeacherId = this.teacher.idNumber
      const labUserId = this.teacher._id
      this.course.laboratory = { instructor:{ _id: labUserId, fullName: labTeacher, idNumber: labTeacherId }, time: labTime, room: labRoom}
    }
    this.course.save(err => {
      if (err) {
        console.log(err);
      }
    })
  }
}

export default CourseUpdateComponent
