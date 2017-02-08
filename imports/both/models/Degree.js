import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'
import Student from './Student'

@SetupCollection('Degrees')
class Degree extends Model {

  static schema = Schemas.degree

  getStudents() {
    return Student.find({ degree: this.name })
  }
}

export default Degree
