import _ from 'underscore'

import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'
import Session from './Session'

@SetupCollection('Courses')
class Course extends Model {

  static schema = Schemas.course

  hasLaboratory() {
    return this.laboratory instanceof 'object'
  }

  enrollAStudent(student) {
    this.students.push(_.pick(student, '_id', 'firstName', 'middleName', 'lastName', 'degree', 'yearLevel'))
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
}

export default Course
