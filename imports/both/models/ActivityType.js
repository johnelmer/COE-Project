import SetupCollection from '../decorators/SetupCollection'
// import schema from '../schemas/ActivityType' TODO:mache ActivityType schema

import Model from './Model'

@SetupCollection('ActivityTypes')
class ActivityType extends Model {
  // static schema = schema
}

export default ActivityType
