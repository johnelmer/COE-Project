import { Component, State, Inject } from 'angular2-now'
import '../views/class-record.html'

import Course from '/imports/both/models/Course'
import Activity from '/imports/both/models/Activity'
import ActivityType from '/imports/both/models/ActivityType'
import Session from '/imports/both/models/Session'
import Student from '/imports/both/models/Student'

@State({
  name: 'app.course.classRecord',
  url: '/teacher/course/classrecord/:courseId',
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
    this.newActivity = { date: new Date(), totalScore: 5 }
    this.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(), // cannot select date after the current day onwards
      startingDay: 1,
    }
    this.popup = {
      opened: false,
    }
  }


  filterActivityList(type) {
    return this.activityList.filter(activity => activity.type === type)
  }

  addNewActivity(type) {
    const newActivity = this.newActivity
    console.log(newActivity)
    const date = newActivity.date
    const session = this.course.getSessionByDate(date)
    console.log(session)
    const activity = session.getNewActivity(type, newActivity.totalScore)
    activity.save()
    this.$state.go(`app.course.session.activityUpdate({ activityId: ${activity._id} })`)
  }

  openPicker() {
    this.popup.opened = true
  }

}
