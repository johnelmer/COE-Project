import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'

import Activity from './Activity'
import Course from './Course'

@SetupCollection('Sessions')
class Session extends Model {

  static schema = Schemas.session

  get course() {
    return Course.find({ _id: this.courseId })
  }

  generateAndGetNewActivity(type, totalScore) {
    const activity = new Activity({
      type: type,
      totalScore: totalScore,
      sessionId: this._id,
    })
    activity.records = this.course.studentIds.map((studentId) => {
      return { studentId: studentId, score: '' }
    })
    return activity
  }

  addActivity(activityId) {
    const activityIds = this.activityIds
    const isExist = activityIds.some(id => id === activityId)
    if (!isExist) {
      activityIds.push(activityId)
    }
  }

  getActivitiesByType(type) {
    return this.getFilteredObjectsFromArray('activities', 'type', type)
  }
}

export default Session
