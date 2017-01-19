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

  get hasParent() {
    return !!this.parent
  }

  get isRoot() {
    return !this.hasParent
  }

  get parent() {
    return Role.findOne({ childIds: this._id })
  }

  get root() {
    return (this.isRoot && this) || this.parent.root
  }

}

export default Role
