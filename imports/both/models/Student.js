import SetupCollection from '../decorators/SetupCollection'

import Model from './Model'
import Course from './Course'

@SetupCollection('Students')
class Student extends Model {
  /* Please add schema for this collection */
  static schema = {}
}

export default Student
