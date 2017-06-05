import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Department.js'
import Degree from './Degree.js'

import Model from './Model'

@SetupCollection('Departments')
class Department extends Model {

  static schema = schema

  get degree() {
    return Degree.findOne({ _id: this.degreeId })
  }
}

export default Department
