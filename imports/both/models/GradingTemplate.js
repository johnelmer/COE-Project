import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/GradingTemplate'
import Model from './Model'

@SetupCollection('GradingTemplates')
class GradingTemplate extends Model {
  static schema = schema

  get activities() {
    const lectActivities = this.lecture.activityTypes
    const labActivities = this.laboratory.activityTypes
    return this.laboratory ? lectActivities.concat(labActivities) : lectActivities
  }
}

export default GradingTemplate
