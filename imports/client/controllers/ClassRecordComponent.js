import Course from '/imports/both/models/Course'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/class-record.html'

@State({
  name: 'app.course.classRecord',
  url: '/teacher/course/classrecord/:courseId',
  resolve: {
    redirect($auth, $location) {
      $auth.awaitUser().then((user) => {
        if (user.hasARole('faculty')) {
          $location.path('/login')
        }
      })
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
      const gradingSubs = this.subscribe('grading-templates')
      const settingSubs = this.subscribe('settings')
      this.course = Course.findOne({ _id: courseId })
      const course = this.course
      this.activityList = []
      if (sessionSubs.ready() && studentSubs.ready() && activitySubs.ready()
        && activityTypeSubs.ready() && gradingSubs.ready() && settingSubs.ready() && course) {
        this.students = course.studentsWithRecords
        this.activityTypes = course.activityTypesWithScores
        this.activities = course.activitiesWithDates
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

  getFilteredArray(arr, key, val) {
    return arr.filter(activity => activity[key] === val)
  }

  getRecordsByType(records, type) {
    return records.filter(record => record.activityType === type)
  }

  getActivitiesByType(type) {
    return this.activities.filter(activity => activity.type === type)
  }

  getComputedScore(student, type) {
    const records = student.records.filter(record => record.activityType === type)
    const activityTypes = this.activityTypes
    const index = activityTypes.findIndex(activityType => activityType.name === type)
    const totalScore = activityTypes[index].totalScore
    const score = (records.length > 1) ? records.reduce((acc, cur) => acc.score + cur.score) :
      (records.length === 1) ? records[0].score : 0
    const percentage = (score !== 0) ? ((score / totalScore) * 100).toFixed(2) : 0
    return `${score} (${percentage}%)`
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
