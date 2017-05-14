import _ from 'underscore'

import SetupCollection from '../decorators/SetupCollection'
import Idempotent from '../decorators/Idempotent'
import schema from '../schemas/Course'

import Model from './Model'
import Session from './Session'
import Student from './Student'
import ActivityType from './ActivityType'

@SetupCollection('Courses')
class Course extends Model {

  static schema = schema

  hasLaboratory() {
    return this.laboratory instanceof 'object'
  }

  enrollAStudent(student) {
    const studentIds = this.studentIds
    const isStudentExists = studentIds.some(studentId => student._id === studentId)
    if (!isStudentExists) {
      studentIds.push(student._id)
    } else {
      throw new Error('Student is already enrolled.')
    }
  }

  @Idempotent
  get students() {
    return Student.find({ _id: { $in: this.studentIds } }, { sort: { lastName: 1 } }).fetch()
  }

  removeStudentFromClass(idNumber) {
    const studentIndex = this.students.findIndex(student => student.studentId === idNumber)
    if (studentIndex === -1) {
      throw new Error('Student is not enrolled on the class.')
    }
    this.students.splice(studentIndex, 1)
  }

  get sessionIds() {
    return this.sessions.map(session => session._id)
  }

  getAllActivities() {
    return this.sessionIds.map((sessionId) => {
      return Session.findOne(sessionId).activities
    })
  }

  getAllActivitiesByType(type) {
    return this.sessionIds.map((sessionId) => {
      return Session.findOne(sessionId).getActivitiesByType(type)
    })
  }

  getSessionByDate(date) {
    const formattedDate = date.toLocaleDateString()
    const sessionObj = this.sessions.find((session) => {
      return session.date.toLocaleDateString() === formattedDate
    })
    if (!sessionObj) {
      return Session.findOne({ _id: this.getNewSessionId(formattedDate) })
    }
    return Session.findOne({ _id: sessionObj._id })
  }

  getNewSessionId(date, callback) {
    const newSession = new Session({
      courseId: this._id,
      attendance: {},
      activityIds: [],
      date: date,
    })
    const sessionId = newSession.save(callback)
    this.sessions.push({
      _id: sessionId,
      date: date,
    })
    return sessionId
  }

  get fullSessions() {
    return Session.find({ _id: { $in: this.sessionIds } }, { sort: { date: 1 } }).fetch()
  }

  get classRecord() {
    const sessions = this.fullSessions
    const students = this.students
    let activities = []
    const activityList = []
    const activityTypes = ActivityType.find().fetch()
    sessions.forEach((session) => {
      if (session.activityIds.length > 0) {
        const sessionActivities = session.activities
        activities = activities.concat(sessionActivities)
        sessionActivities.forEach((activity) => {
          activityList.push({
            _id: activity._id,
            type: activity.type,
            totalScore: activity.totalScore,
            date: session.date.toLocaleDateString(),
          })
        })
      }
    })
    activityTypes.forEach((type) => {
      students.forEach(student => student[type.name] = [])
    })
    activities.forEach((activity) => {
      activity.records.forEach((record) => {
        const index = students.findIndex(student => record.studentId === student._id)
        if (index !== -1) {
          students[index][activity.type].push({ activityId: activity._id, score: record.score })
        }
      })
    })
    return { activityTypes: activityTypes, activityList: activityList, students: students }
  }
}

export default Course
