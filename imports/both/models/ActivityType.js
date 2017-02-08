import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'

@SetupCollection('ActivityTypes')
class ActivityType extends Model {
  static schema = Schemas.activitytype
}

export default ActivityType
