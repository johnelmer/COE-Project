import User from './User'
import SetupAccount from '../decorators/SetupAccount'

@SetupAccount
class Teacher extends User {

}

export default Teacher
