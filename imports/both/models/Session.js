import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'

@SetupCollection('Sessions')
class Session extends Model {

  static schema = Schemas.session

  addActivity(activity) {
    this.activities.push(activity)
  }

  getActivitiesByType(type) {
    return this.getFilteredObjectsFromArray('activities', 'type', type)
  }
}

export default Session
