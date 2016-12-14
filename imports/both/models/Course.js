import _ from 'underscore'

import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'

@SetupCollection('Courses')
class Course extends Model {

  static schema = Schemas.Course

  hasLaboratory() {
    return this.laboratory instanceof 'object'
  }

  enrollAStudent(student) {
    this.students.push(_.pick(student, '_id', 'firstName', 'middleName', 'lastName', 'degree', 'yearLevel'))
  }
}

export default Course
