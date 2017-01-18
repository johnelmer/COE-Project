import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'

@SetupCollection('Activity')
class Activity extends Model {

  static schema = {}

}

export default Activity
