import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'

@SetupCollection('Degrees')
class Degree extends Model {

  static schema = Schemas.degree
}

export default Degree
