import SetupCollection from '../decorators/SetupCollection'

import Model from './Model'
import Course from './Course'
import Schemas from '../Schemas'

@SetupCollection('Students')
class Student extends Model {
  static schema = Schemas.student
}

export default Student
