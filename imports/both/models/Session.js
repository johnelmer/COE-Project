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

  generateAndGetNewActivity(type, totalScore) {
    const activity = new Activity({
      type: type,
      totalScore: totalScore,
      sessionId: this._id,
    })
    activity.records = this.course.studentIds.map((studentId) => {
      return { studentId: studentId, score: '' }
    })
    return activity
  }

  addActivity(activityId) {
    const activityIds = this.activityIds
    const isExist = activityIds.some(id => id === activityId)
    if (!isExist) {
      activityIds.push(activityId)
    }
  }

  getActivitiesByType(type) {
    return this.getFilteredObjectsFromArray('activities', 'type', type)
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
    return students
  }

  get activities() {
    return Activity.find({ _id: { $in: this.activityIds } }).fetch()
  }
}

export default Session
