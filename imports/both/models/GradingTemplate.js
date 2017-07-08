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

  computeCategoryRatings(scoresDoc) { // compute ratings for each category(lecture, laboratory)
    const categories = this.categories
    return categories.map((category) => {
      const doc = {}
      doc[category] = {
        percentage: 0,
        rating: 0,
      }
      const types = this.getActivityTypes(category)
      const activitiesRatings = types.map((type) => {
        return (scoresDoc[type.name]) ? scoresDoc[type.name].overallRating : 0
      })
      const percentage = activitiesRatings.reduce((acc, cur) => acc + cur)
      const rating = ((percentage / 100) * this[category].percentage)
      doc[category].percentage = percentage
      doc[category].rating = rating
      return doc
    })
  }

  get categories() {
    return (this.laboratory) ? ['lecture', 'laboratory'] : ['lecture']
  }
}

export default GradingTemplate
