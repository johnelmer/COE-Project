import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Degree.js'

import Model from './Model'
import Student from './Student'

@SetupCollection('Degrees')
class Degree extends Model {

  static schema = schema

  getStudents() {
    return Student.find({ degree: this.name })
  }
}

export default Degree
