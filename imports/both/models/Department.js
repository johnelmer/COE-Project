import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Department.js'

import Model from './Model'

@SetupCollection('Departments')
class Department extends Model {

  static schema = schema
}

export default Department
