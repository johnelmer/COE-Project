import SetupCollection from '../decorators/SetupCollection'
import Model from './Model'

import schema from '../schemas/AppSetting'

@SetupCollection('AppSettings')
class AppSetting extends Model {

  static schema = schema

}

export default AppSetting
