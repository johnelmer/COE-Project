import Model from './Model'
import Schemas from '../Schemas'

class Role extends Model {

  static schema = Schemas.role
  is(roleName) {
    return this.name === roleName
  }

  get hasAChild() {
    return this.children.length !== 0
  }

  hasARole(roleName) {
    return this.is(roleName) || this.children.some(child => child.hasARole(roleName))
  }

  get ancestors() {
    return Role.find({ childIds: { $elemMatch: { $in: [this._id] } } }).fetch()
  }
}

export default Role
