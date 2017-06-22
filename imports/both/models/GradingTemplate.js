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
      const lab = this.laboratory
      const labActivities = (lab) ? lab.activityTypes.map((type) => {
        type.category = 'laboratory'
        return type
      }) : []
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

  computeStanding(scoresDoc) {
    const categories = this.categories
    const resultArray = categories.map((category) => {
      const doc = {}
      const types = this.getActivityTypes(category)
      const activitiesPercentages = types.map(type => (scoresDoc[type.name].percentage / 100) * type.percentage)
      doc[category] = activitiesPercentages.reduce((acc, cur) => acc + cur)
      return doc
    })
    if (categories.length > 1) {
      return Object.assign(resultArray[0], resultArray[1])
    }
    return resultArray[0]
  }

  computeTotalScores(activities) {
    const categories = this.categories
    categories.map((category) => {
      const activityTypes = this.activityTypes
    })
  }

  get categories() {
    return (this.laboratory) ? ['lecture', 'laboratory'] : ['lecture']
  }
}

export default GradingTemplate
