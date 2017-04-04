import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Meeting.js'

import Model from './Model'

@SetupCollection('Meetings')
class Meeting extends Model {

  static schema = schema
}

export default Meeting
