import _ from 'underscore'
import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Session'

import Model from './Model'
import Activity from './Activity'
import Course from './Course'

@SetupCollection('Sessions')
class Session extends Model {

  static schema = schema

  get course() {
    return Course.findOne({ _id: this.courseId })
  }

  getNewActivity(type, totalScore, description) {
    const activityId = new Activity({
      type: type,
      totalScore: totalScore,
      description: description,
      sessionId: this._id,
      isLocked: false,
    }).save()
    this.addActivity(activityId)
    const activity = Activity.findOne({ _id: activityId })
    activity.records = this.course.studentIds.map((studentId) => {
      return { studentId: studentId, score: '' }
    })
    activity.save()
    return activity
  }

  addActivity(activityId) {
    const activityIds = this.activityIds
    const isExist = activityIds.some(id => id === activityId)
    if (!isExist) {
      activityIds.push(activityId)
    }
  }

  getActivities(type) {
    return (type) ? Activity.find({ sessionId: this._id, type: type }).fetch() : this.activities
  }

  addStudentAttendance(student, type) {
 /*   const attendances = this.studentAttendances //might not be needed since array is emptied
    const studentId = student._id
    const index = attendances.findIndex(attendance => attendance.studentId === studentId)
*/
    if (type !== '') {
      this.studentAttendances.push({
        studentId: student._id,
        type: type,
      })
    }
  }

  get attendances() {
    const students = this.course.students
    const attendances = this.studentAttendances
    return students.map((student) => {
      const index = attendances.findIndex(attendance => attendance.studentId === student._id)
      if (index === -1) {
        student.attendance = ''
      } else {
        student.attendance = attendances[index].type
      }
      return student
    })
  }

  get activities() {
    return Activity.find({ _id: { $in: this.activityIds } }).fetch()
  }

  get activitiesWithDate() {
    return this.activities.map((activity) => {
      activity.date = this.date.toLocaleDateString()
      return activity
    })
  }

  get activityRecords() {
    const activities = this.activities.map(activity => activity.recordList)
    return _.flatten(activities)
  }
}

export default Session
