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
        this.doc = course.classRecord
        this.sessions = course.sessions
        this.activityTypes = course.activityTypesWithScores
        this.activities = course.activitiesWithDates
        this.courseTypes = course.currentUserHandledTypes
        this.newActivity = { date: new Date(), totalScore: 5, description: '' }
        this.newAttendance = { date: new Date(), sessionType: this.courseTypes[0] }
      }
    })
    this.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(), // cannot select date after the current day onwards
      startingDay: 1,
    }
    this.popup = {
      opened: false,
    }
  }

  get ratingTableHeaders() {
    const record = this.doc.records[0]
    if (!record.lecture && record.laboratory) {
      return ['Rating']
    }
    return ['Lecture Rating', 'Laboratory Rating', 'Final Rating', 'GPA']
  }

  getAttendanceValue(type) {
    return (type === 'Present') ? 'P' : (type === 'Late') ? 'L' : (type === 'Absent') ? 'A' : (type === 'Excuse') ? 'E' : ''
  }

  getStudentRecord(student) {
    const records = this.doc.records
    const index = records.findIndex(record => record.studentId === student._id)
    if (index === -1) {
      return {}
    }
    return records[index]
  }

  getStudentActivityStanding(student, type) {
    const record = this.getStudentRecord(student)
    const activity = record.activitiesObj[type]
    if (!activity) {
      return '0 (0%)'
    }
    return `${activity.score} (${activity.totalScorePercentage.toFixed(2)} %)`
  }

  getStudentActivitiesByType(student, type) {
    const record = this.getStudentRecord(student)
    const activityType = record.activitiesObj[type]
    if (!activityType) {
      return []
    }
    return activityType.records
  }

  getFilteredArray(arr, key, val) {
    return arr.filter(activity => activity[key] === val)
  }

  getRecordsByType(records, type) {
    return records.filter(record => record.activityType === type)
  }

  getActivitiesByType(type) {
    return this.doc.activities.filter(activity => activity.type === type)
  }

  getFilterredArray(array, key, value) {
    return array.filter(obj => obj[key] === value)
  }

  getComputedScore(student, type) {
    const records = student.records.filter(record => record.activityType === type)
    const activityTypes = this.activityTypes
    const index = activityTypes.findIndex(activityType => activityType.name === type)
    const totalScore = activityTypes[index].totalScore
    const score = (records.length > 1) ? records.reduce((acc, cur) => {
      return { score: acc.score + cur.score }
    }).score :
      (records.length === 1) ? records[0].score : 0
    const percentage = (score !== 0) ? ((score / totalScore) * 100).toFixed(2) : 0
    return `${score} (${percentage}%)`
  }

  addNewActivity(activityType) {
    const newActivity = this.newActivity
    const session = this.course.getSessionByDate(newActivity.date, activityType.category)
    const activity = session.getNewActivity(activityType.name, newActivity.totalScore, newActivity.description)
    activity.save()
    session.save()
    this.course.save()
    this.$state.go('app.course.session.activityUpdate', { activityId: activity._id })
  }

  addNewAttendance() {
    const newAttendance = this.newAttendance
    const date = newAttendance.date
    const sessionType = newAttendance.sessionType
    const session = this.course.getSessionByDate(date, sessionType)

    session.save()
    this.course.save()
    this.$state.go('app.course.session.attendanceUpdate', { sessionId: session._id })
  }

  getAttendanceAdds(session) {
    return (session.type === 'laboratory') ? '(Lab)' : ''
  }

  openPicker() {
    this.popup.opened = true
  }

}

export default ClassRecordComponent
