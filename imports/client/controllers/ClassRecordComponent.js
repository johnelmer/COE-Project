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
      const gradeTransmutationSubs = this.subscribe('grade-transmutations')
      this.course = Course.findOne({ _id: courseId })
      const course = this.course
      this.activityList = []
      if (sessionSubs.ready() && studentSubs.ready() && activitySubs.ready()
        && activityTypeSubs.ready() && gradingSubs.ready() && settingSubs.ready()
        && gradeTransmutationSubs.ready() && course) {
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
    const type = this.doc.type
    if (type === 'laboratory only') {
      return ['Rating']
    } else if (type === 'lecture only') {
      return ['Rating', 'GPA']
    }
    return ['Lecture Rating', 'Laboratory Rating', 'Final Rating', 'GPA']
  }

  getRating(record, ratingType) {
    let value = ''
    switch (ratingType) {
      case 'Rating':
        value = record.finalRating
        break
      case 'Final Rating':
        value = record.finalRating
        break
      case 'Lecture Rating':
        value = record.lecture.rating
        break
      case 'Laboratory Rating':
        value = record.laboratory.rating
        break
      case 'GPA':
        value = record.gpa
        break
      default:
        value = '-'
    }
    return (value !== '-' && ratingType !== 'GPA') ? `${value.toFixed(2)}%` : value
  }

/*  toCamelCase(str) {
    return str.toLowerCase().replace(/\W+(.)/g, (match, chr) => chr.toUppercase())
  } */

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
