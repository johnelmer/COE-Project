import _ from 'underscore'

import SetupCollection from '../decorators/SetupCollection'
import Idempotent from '../decorators/Idempotent'
import schema from '../schemas/Course'

import Model from './Model'
import Session from './Session'
import Student from './Student'
import GradingTemplate from './GradingTemplate'

@SetupCollection('Courses')
class Course extends Model {

  static schema = schema

  get hasALaboratory() {
    return typeof this.laboratory === 'object'
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

  get activities() {
    const unFlattenedActivities = this.fullSessions.map(session => session.activities)
    return unFlattenedActivities.reduce((acc, curr) => acc.concat(curr))
  }

  get activitiesWithDate() {
    const unFlattenedActivities = this.fullSessions.map(session => session.activitiesWithDate)
    return unFlattenedActivities.reduce((acc, curr) => acc.concat(curr))
  }

  getAllActivitiesByType(type) {
    return this.fullSessions.map(session => session.getActivitiesByType(type))
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

  get fullGradingTemplate() {
    return GradingTemplate.findOne({ _id: this.gradingTemplate._id })
  }

  get classRecord() {
    const students = this.students
    const gradingTemplate = this.fullGradingTemplate
    const activities = this.activitiesWithDate
    const activityList = activities.map(activity => _(activity).omit('records', 'isLocked'))
    const activityTypes = gradingTemplate.activities
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
