import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/GradingTemplate'
import Model from './Model'

import _ from 'underscore'

@SetupCollection('GradingTemplates')
class GradingTemplate extends Model {
  static schema = schema

  getActivityTypes(category) { // Not dry; to be refactor
    if (category && this[category]) {
      return this[category].activityTypes.map((type) => {
        type.category = category
        return type
      })
    } else if (!category) {
      const lectActivities = this.lecture.activityTypes.map((type) => {
        type.category = 'lecture'
        return type
      })
      const labActivities = this.laboratory.activityTypes.map((type) => {
        type.category = 'laboratory'
        return type
      })
      return _.flatten(lectActivities.concat(labActivities))
    }
    return []
  }

  get activityTypes() {
    return {
      lecture: this.lecture.activityTypes.map((type) => {
        type.category = 'lecture'
        return type
      }),
      laboratory: this.laboratory.activityTypes.map((type) => {
        type.category = 'laboratory'
        return type
      }),
    }
  }

  get categories() {
    return (this.laboratory) ? ['lecture', 'laboratory'] : ['lecture']
  }
}

export default GradingTemplate
