import Course from '/imports/both/models/Course'
import Role from '/imports/both/models/Role'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/course-update.html'

@State({
  name: 'app.course.assign.update',
  url: '/course/update/:courseId',
  resolve: {
    redirect($state) {
      const { roleName } = Meteor.user()
      const role = Role.findOne({ name: roleName })
      return role.hasARole('secretary') || $state.go('app.login')
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
    this.helpers({
      course() {
        return Course.findOne({ _id: courseId })
      },
    })
  }

  save() {
  //  TODO: update of the course
  }
}

export default CourseUpdateComponent
