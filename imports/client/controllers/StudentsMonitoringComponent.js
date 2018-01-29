import _ from 'underscore'
import Course from '/imports/both/models/Course'
import Activity from '/imports/both/models/Activity'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/students-monitoring.html'

@State({
  name: 'app.student.monitor',
  url: '/students/monitor',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user() && Meteor.user().hasARole('faculty')
      return isAuthorized || $location.path('/login')
    },
  },
})
@Component({
  selector: 'students-monitor',
  templateUrl: 'imports/client/views/students-monitoring.html',
})
@Inject('$scope', '$reactive')
class StudentsMonitoringComponent {

  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.ready = false
    this.autorun(() => {
      const subs = [
        this.subscribe('courses'),
        this.subscribe('students'),
        this.subscribe('sessions'),
        this.subscribe('activities'),
        this.subscribe('activity-types'),
        this.subscribe('grading-templates'),
        this.subscribe('settings'),
        this.subscribe('grade-transmutations'),
      ]
      this.isReady = subs.every(sub => sub.ready())
    })
    this.helpers({
      records() {
        const isPossible = Activity.find({ type: { $in: ['Midterm Exam', 'Midsummer Exam'] } }).count() > 0
        if (isPossible) {
          this.isThereData = true
          const courses = Course.find().fetch()
          return _.flatten(courses.map(course => course.studentsWithRecords)).filter(record => record.status === 'In danger of failing' || record.status === 'Failed')
        }
        return []
      },
    })
  }

  getFilteredRecords(type) {
    return this.records.filter(record => record.status === type)
  }
}

export default StudentsMonitoringComponent
