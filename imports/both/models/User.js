import _ from 'underscore'
import Model from './Model'

import SetupAccount from '../decorators/SetupAccount'

@SetupAccount()
class User extends Model {

}

export default User