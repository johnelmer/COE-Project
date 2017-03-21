import _ from 'underscore'

import SetupCollection from '../decorators/SetupCollection'
import Idempotent from '../decorators/Idempotent'
import schema from '../schemas/Course'

import Model from './Model'
import Session from './Session'
import Student from './Student'

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
    return Student.find({ _id: { $in: this.studentIds } }).fetch()
  }

  removeStudentFromClass(idNumber) {
    const studentIndex = this.students.findIndex(student => student.studentId === idNumber)
    if (studentIndex === -1) {
      throw new Error('Student is not enrolled on the class.')
    }
    this.students.splice(studentIndex, 1)
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

  getStudentsSortedByLastName() {
    return this.students.sort((a, b) => {
      const nameA = a.lastName.toUpperCase();
      const nameB = b.lastName.toUpperCase();
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    })
  }

  createSession(date, callback) {
    const isSessionExist = this.sessions.some(session => session.date === date)
    if (isSessionExist) {
      console.log('Session is already exist')
    } else {
      const newSession = new Session({
        courseId: this._id,
        attendance: {},
        activities: [],
        date: date,
      })
      newSession.save(callback)
      const newlyCreatedSession = Session.findOne({ date: date })
      this.sessions.push({
        _id: newlyCreatedSession._id,
        date: date,
      })
    }
  }

  get sessions() {
    return Session.find({ _id: { $in: this.sessionIds } }).fetch()
  }
}

export default Course
