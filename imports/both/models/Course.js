import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'

@SetupCollection('Courses')
class Course extends Model {

  static schema = Schemas.Course
}

export default Course
