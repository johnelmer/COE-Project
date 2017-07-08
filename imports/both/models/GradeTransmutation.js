import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/GradeTransmutation.js'
import Model from './Model'

@SetupCollection('GradeTransmutations')
class GradeTransmutation extends Model {

  static schema = schema

  getGpaByRating(rating) {
    const gpaList = this.gpaList
    const index = gpaList.findIndex(gpa => rating >= gpa.min && rating <= gpa.max)
    if (index === -1) { return '-' }
    return gpaList[index].equivalent
  }

}

export default GradeTransmutation
