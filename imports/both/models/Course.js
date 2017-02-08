import _ from 'underscore'

import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'
import Session from './Session'

@SetupCollection('Courses')
class Course extends Model {

  static schema = Schemas.course

  hasLaboratory() {
    return this.laboratory instanceof 'object' && Object.keys(this.laboratory).length === 0
  }

  enrollAStudent(student) {
    this.students.push(_.pick(student, '_id', 'firstName', 'middleName', 'lastName', 'degree', 'yearLevel'))
  }

  removeStudentFromClass(idNumber) {
    const studentIndex = this.students.findIndex(student => student.studentId === idNumber)
    if (studentIndex !== -1) {
      this.students.splice(studentIndex, 1)
    }
  }
/*
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
*/
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

  addSession(sessionId) {
    const isKeyExist = Object.prototype.hasOwnProperty.call(this, 'sessionIds')
    if (isKeyExist) {
      const sessionIds = this.sessionIds
      const isSessionExist = sessionIds.some(id => id === sessionId)
      if (!isSessionExist) {
        sessionIds.push(sessionId)
      }
    } else {
      this.sessionIds = [sessionId]
    }
  }

  get sessions() {
    return Session.find({ courseId: this._id }).fetch()
  }

/*
  createSession(date, callback) {
    const isSessionExist = this.sessions.some(session => session.date === date)
    if (isSessionExist) {
      console.log('Session is already exist')
    } else {
      return newSession = new Session({
        courseId: this._id,
        attendance: {},
        activities: [],
        date: date,
      })
    }
  }*/
}

export default Course
