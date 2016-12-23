import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'

@SetupCollection('Sessions')
class Session extends Model {
// TODO: Add schema for Session
//  static schema = Schemas.Session

  addActivity(activity) {
    this.activities.push(activity)
  }

  getQuizActivities() {
    return this.getFilteredObjectsFromArray('activities', 'type', 'Quiz')
  }

  getHomeworkActivities() {
    return this.getFilteredObjectsFromArray('activities', 'type', 'Homework')
  }

  getMajorExamActivities() {
    return this.getFilteredObjectsFromArray('activities', 'type', 'Exam')
  }
}

export default Session
