import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Session'

import Model from './Model'
import Activity from './Activity'

@SetupCollection('Sessions')
class Session extends Model {

  static schema = schema

  addActivity(activityId) {
    const activityIds = this.activityIds
    const isExist = activityIds.some(id => id === activityId)
    if (!isExist) {
      activityIds.push(activityId)
    }
  }

  getActivities(options = {}) {
    options.sessionId = this._id
    return Activity.find(options).fetch()
  }
}

export default Session
