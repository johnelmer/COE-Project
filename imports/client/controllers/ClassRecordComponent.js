import { Component, State, Inject } from 'angular2-now'
import '../views/class-record.html'

import Course from '/imports/both/models/Course'
import Activity from '/imports/both/models/Activity'
import ActivityType from '/imports/both/models/ActivityType'
import Session from '/imports/both/models/Session'
import Student from '/imports/both/models/Student'

@State({
  name: 'app.course.classRecord',
  url: '/course/classrecord/:courseId',
})
@Component({
  selector: 'class-record',
  templateUrl: 'imports/client/views/class-record.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
export default class ClassRecordComponent {
  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    const { courseId } = $stateParams
    this.subscribe('courses', () => {
      const sessionSubs = this.subscribe('sessions')
      const studentSubs = this.subscribe('students-basic-infos')
      const activitySubs = this.subscribe('activities')
      const activityTypeSubs = this.subscribe('activity-types')
      this.course = Course.findOne({ _id: courseId })
      const course = this.course
      this.activityList = []
      if (sessionSubs.ready() && studentSubs.ready() && activitySubs.ready()
        && activityTypeSubs.ready() && course) {
        const classRecord = course.classRecord
        const students = classRecord.students
        this.students = students
        console.log(classRecord)
        this.activityTypes = classRecord.activityTypes
        this.activityList = classRecord.activityList
      }
    })
  }


  filterActivityList(type) {
    return this.activityList.filter(activity => activity.type === type)
  }

}

// export default ClassRecordComponent
