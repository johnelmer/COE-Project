import Course from '/imports/both/models/Course'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Component, State, Inject } from 'angular2-now'
import '../views/class-record.html'

@State({
  name: 'app.course.classRecord',
  url: '/teacher/course/classrecord/:courseId',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user() && Meteor.user().hasARole('faculty')
      return isAuthorized || $location.path('/login')
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
    this.user = Meteor.user()
    const user = this.user
    const userId = user._id
    // const courses = Meteor.subscribe('courses')
    // const sessions = Meteor.subscribe('sessions')
    // const students = Meteor.subscribe('students')
    // const activities = Meteor.subscribe('activities')
    // const activityTypes = Meteor.subscribe('activity-types')
    // const gradingTemplates = Meteor.subscribe('grading-templates')
    // const settings = Meteor.subscribe('settings')
    // const gradeTransmutations = Meteor.subscribe('grade-transmutations')
    // const subs = [courses, sessions, students, activities, activityTypes,
    //   gradingTemplates, settings, gradeTransmutations]
    // const isSubsReady = subs.every(sub => sub.ready())
    // if (isSubsReady) {
    //   this.isSubsReady = isSubsReady
    //   this.course = Course.findOne({ _id: courseId })
    //   const course = this.course
    //   this.activityList = []
    //   this.students = course.students
    //   this.user = Meteor.user()
    //   this.doc = course.classRecord
    //   this.sessions = course.sessions
    //   this.activityTypes = course.activityTypesWithScores
    //   this.activities = course.activitiesWithDates
    //   this.courseTypes = course.currentUserHandledTypes
    //   this.newActivity = { date: new Date(), totalScore: 5, description: '' }
    //   this.newAttendance = { date: new Date(), sessionType: this.courseTypes[0] }
    // }
    this.autorun(() => {
      const subs = [
        this.subscribe('teacherCourses', () => [userId]),
        this.subscribe('sessions'),
        this.subscribe('students'),
        this.subscribe('activities'),
        this.subscribe('activity-types'),
        this.subscribe('grading-templates'),
        this.subscribe('settings'),
        this.subscribe('grade-transmutations'),
      ]
      this.isReady = subs.every(sub => sub.ready())
      this.activityList = []
      if (this.isReady) {
        const {
          students,
          classRecord,
          sessions,
          activityTypesWithScores,
          activitiesWithDates,
          currentUserHandledTypes,
        } = this.course
        this.students = students
        this.doc = classRecord
        this.sessions = sessions
        this.activityTypes = activityTypesWithScores
        this.activities = activitiesWithDates
        this.courseTypes = currentUserHandledTypes
        this.newActivity = { date: new Date(), totalScore: 5, description: '' }
        this.newAttendance = { date: new Date(), sessionType: this.courseTypes[0] }
        this.dateOptions = {
          formatYear: 'yy',
          maxDate: new Date(), // cannot select date after the current day onwards
          startingDay: 1,
        }
        this.popup = {
          opened: false,
        }
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
    this.helpers({
      course() {
        return Course.findOne({ _id: courseId })
      },
    })
  }

  get ratingTableHeaders() {
    if (this.doc) {
      const type = this.doc.type
      if (type === 'laboratory only') {
        return ['Rating']
      } else if (type === 'lecture only') {
        return ['Rating', 'Final Grade']
      }
      return ['Lecture Rating', 'Laboratory Rating', 'Final Rating', 'Final Grade']
    }
    return []
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
      case 'Final Grade':
        value = record.finalGrade
        break
      default:
        value = '-'
    }
    return (value !== '-' && ratingType !== 'Final Grade') ? `${value.toFixed(2)}%` : value
  }

  shouldActivityTypeHide(activityType) {
    if (!activityType.isMultiple) {
      return this.course.hasActivity(activityType.name)
    }
    return false
  }

  shouldActivityEditHide(activity) {
    if (this.user.roleName === 'dean') {
      return false
    }
    return activity.isLocked
  }

  getAttendanceValue(type) {
    return (type === 'Present') ? 'P' : (type === 'Late') ? 'L' : (type === 'Absent') ? 'A' : (type === 'Excuse') ? 'E' : ''
  }

  getStudentRecord(student) {
    const records = this.doc.records
    const index = records.findIndex(record => record.student._id === student._id)
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

  getStudentQuestPts(student) {
    return this.course.getStudentQuestPts(student)
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

  passClassRecord() {
    this.course.passClassRecord()
  }

  get shouldShowApproveDenyBtn() {
    // const course = this.course
    // if (course) {
    //   if (course.customGradingTemplate === undefined) {
    //     return false
    //   }
    //   const custom = this.course.customGradingTemplate
    //   return this.user.roleName === 'dean' && !custom.isApproved
    // }
    return false
  }

  openPicker() {
    this.popup.opened = true
  }

}

export default ClassRecordComponent
