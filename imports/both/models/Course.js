import _ from 'underscore'
import { Meteor } from 'meteor/meteor'

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
    if (!this.isStudentEnrolled(student)) {
      studentIds.push(student._id)
    } else {
      throw new Error('Student is already enrolled.')
    }
  }

  isStudentEnrolled(student) {
    return this.studentIds.some(studentId => student._id === studentId)
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
    return _.flatten(this.types.map((type) => {
      return this[type].sessions.map(session => session._id)
    }))
  }

  get activities() {
    const activities = this.sessions.map(session => session.activities)
    return _.flatten(activities)
  }

  get activitiesWithDates() {
    const activities = this.sessions.map(session => session.activitiesWithDate)
    return _.flatten(activities)
  }

  getActivities(type) {
    return (type) ? this.sessions.map(session => session.getActivities(type)) : this.activities
  }

  getSessionByDate(date, type) {
    const formattedDate = date.toLocaleDateString()
    const sessionObj = this[type].sessions.find((session) => {
      return session.date.toLocaleDateString() === formattedDate
    })
    if (!sessionObj) {
      return Session.findOne({ _id: this.getNewSessionId(formattedDate, type) })
    }
    return Session.findOne({ _id: sessionObj._id })
  }

  getNewSessionId(date, type, callback) {
    const studentAttendances = this.studentIds.map((id) => {
      return { studentId: id, type: 'Present' }
    })
    const sessionId = new Session({
      courseId: this._id,
      type: type,
      studentAttendances: studentAttendances,
      activityIds: [],
      date: date,
    }).save(callback)
    this[type].sessions.push({ _id: sessionId, date: date })
    return sessionId
  }

  getSessionsByTypes(types) {
    return Session.find({ _id: { $in: this.sessionIds },
      type: { $in: types } }, { sort: { date: 1 } }).fetch()
  }

  get sessions() {
    return Session.find({ _id: { $in: this.sessionIds } },
      { sort: { date: 1 } }, { sort: { date: 1 } }).fetch()
  }

  get fullGradingTemplate() {
    return GradingTemplate.findOne({ _id: this.gradingTemplate._id })
  }

  get activityRecords() {
    const activities = this.sessions.map(session => session.activityRecords)
    return _.flatten(activities)
  }

  get studentAttendances() {
    const attendances = this.sessions.map((session) => {
      return session.studentAttendances.map((attendance) => {
        attendance.sessionId = session._id
        attendance.date = session.date.toLocaleDateString()
        attendance.category = session.type
        return attendance
      })
    })
    return _.flatten(attendances)
  }

  get activityTypes() {
    return this.fullGradingTemplate.getActivityTypes()
  }

  get currentUserHandledTypes() { // returns array with values of Laboratory, Lecture or both
    return this.types.filter(type => this[type].instructor._id === Meteor.userId())
  }

  get types() {
    return (this.hasALaboratory) ? ['lecture', 'laboratory'] : ['lecture']
  }

  get activityTypesWithScores() {
    const activityTypes = this.activityTypes
    const activities = this.activities
    return activityTypes.map((type) => {
      const filteredActivities = activities.filter(activity => activity.type === type.name)
      type.totalScore = 0
      if (filteredActivities.length > 1) {
        return filteredActivities.reduce((acc, cur) => {
          type.totalScore = acc.totalScore + cur.totalScore
          return type
        })
      } else if (filteredActivities.length === 1) {
        type.totalScore = filteredActivities[0].totalScore
        return type
      }
      return type
    })
  }

  get studentsWithRecords() {
    const activityRecords = this.activityRecords
    return this.students.map((student) => {
      const records = activityRecords.filter(record => record.studentId === student._id)
      const attendances = this.studentAttendances.filter(attendance => attendance.studentId === student._id)
      student.attendances = attendances.map(attendance => _(attendance).omit('studentId'))
      student.records = records.map(record => _(record).omit('studentId'))
      return student
    })
  }

  get classRecord() {
    this.students.map((student) => {
      const computeRecords = this.computeStudentRecords(student)
      const standing = this.fullGradingTemplate.computeStanding(computeRecords)
      console.log(computeRecords)
      console.log(standing)
    })
  }

  computeStudentRecords(student) {
    const records = this.activityRecords.filter(record => record.studentId === student._id)
    const computedRecords = this.computeRecords(records)
    return computedRecords
  }

  computeActivityPercentages(scoresDoc) {
    const doc = scoresDoc
    this.activityTypesWithScores.forEach((type) => {
      const percentage = ((doc[type.name].score / type.totalScore) * 100).toFixed(4)
      Object.assign(doc[type.name], { percentage: percentage })
    })
    return doc
  }

  computeRecords(records) {
    const scoresDoc = records.reduce((acc, cur, index, arr) => {
      const activityType = cur.activityType
      if (index === 1) {
        const obj = {}
        const arr1 = arr[0]
        const arr2 = arr[1]
        if (arr1.activityType === arr2.activityType) {
          obj[cur.activityType] = { score: arr1.score + arr2.score }
        } else {
          obj[arr1.activityType] = { score: arr1.score }
          obj[arr2.activityType] = { score: arr2.score }
        }
        return obj
      } else if (index > 1 && !acc[activityType]) {
        acc[activityType] = { score: cur.score }
      } else {
        acc[activityType].score += cur.score
      }
      return acc
    })
    this.activityTypesWithScores.forEach((type) => {
      const percentage = ((scoresDoc[type.name].score / type.totalScore) * 100).toFixed(4)
      Object.assign(scoresDoc[type.name], { percentage: percentage })
    })
    return scoresDoc
  }

  getStudentStanding(student) {
    const records = this.activityRecords.filter(record => record.studentId === student._id)

  }

  getStudentGradeSummary(student) {
    const activityRecords = this.activityRecords
    const records = activityRecords.filter(record => record.studentId === student._id)
  }
}

export default Course
