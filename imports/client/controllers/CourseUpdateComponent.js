import Course from '/imports/both/models/Course'
import Role from '/imports/both/models/Role'
import User from '/imports/both/models/User'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Component, State, Inject } from 'angular2-now'
import '../views/course-update.html'

@State({
  name: 'app.course.assign.update',
  url: '/course/update/:courseId',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user().hasARole('faculty')
      return isAuthorized || $location.path('/login')
    },
    resolve() {
      return new Promise((resolve) => {
        Tracker.autorun(() => {
          const courses = Meteor.subscribe('courses')
          const teachers = Meteor.subscribe('teachers')
          const subs = [teachers, courses]
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
  selector: 'courseData-update',
  templateUrl: 'imports/client/views/course-update.html',
})
@Inject('$scope', '$reactive', '$stateParams')
class CourseUpdateComponent {
  constructor($scope, $reactive, $stateParams) {
    $reactive(this).attach($scope)
    const { courseId } = $stateParams
    this.helpers({
      course() {
        return Course.findOne({ _id: courseId })
      },
      teachers() {
        return User.find().fetch()
      },
    })
  }

  save() {
    if (this.course.laboratory.instructor) {
      const { instructor } = this.course.laboratory
      const { _id, fullName, idNumber } = instructor
      const lab = {
        instructor: {
          _id: _id,
          fullName: fullName,
          idNumber: idNumber,
        },
      }
      Object.assign(this.course.laboratory, lab)
    }
    const { instructor } = this.course.lecture
    const { _id, fullName, idNumber } = instructor
    this.course.lecture.instructor = {
      _id: _id,
      fullName: fullName,
      idNumber: idNumber,
    }
    this.course.save((err) => {
      if (err) {
        console.log(err);
      }
    })
  }
}

export default CourseUpdateComponent
