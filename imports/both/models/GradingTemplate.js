import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/GradingTemplate'
import Model from './Model'

@SetupCollection('GradingTemplates')
class GradingTemplate extends Model {
  static schema = schema

  getActivityTypes(classType) {
    const lectActivityTypes = this.lecture.activityTypes
    const laboratory = this.laboratory
    const selectedClassType = this[classType]
    if (classType && selectedClassType) {
      return selectedClassType.activityTypes
    } else if (classType && !selectedClassType) {
      return []
    } else if (laboratory) {
      return lectActivityTypes.concat(laboratory.activityTypes)
    }
    return lectActivityTypes
  }
}

export default GradingTemplate
