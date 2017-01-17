import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'

@SetupCollection('Sessions')
class Course extends Model {

//  static schema = Schemas.Session

  addActivity(activity) {
    this.activities.push(activity)
  }

  getActivitiesByType(type) {
    return this.getFilteredObjectsFromArray('activities', 'type', type)
  }
}

export default Course
