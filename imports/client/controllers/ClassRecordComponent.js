import Course from '/imports/both/models/Course'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/class-record.html'

@State({
  name: 'app.course.classRecord',
  url: '/teacher/course/classrecord/:courseId',
  resolve: {
    redirect($location) {
      const user = Meteor.user()
      return user.hasARole('faculty') || $location.path('/login')
    },
  },
})
@Component({
  selector: 'class-record',
  templateUrl: 'imports/client/views/class-record.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class ClassRecordComponent {

  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    const { courseId } = $stateParams
    this.$state = $state
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
    const date = newActivity.date
    const session = this.course.getSessionByDate(date)
    const activity = session.getNewActivity(type, newActivity.totalScore)
    activity.save()
    session.save()
    this.course.save()
    this.$state.go('app.course.session.activityUpdate', { activityId: activity._id })
  }

  openPicker() {
    this.popup.opened = true
  }

}

export default ClassRecordComponent
