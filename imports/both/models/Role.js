import Model from './Model'
import schema from '../schemas/Role'

import SetupCollection from '../decorators/SetupCollection'
import Idempotent from '../decorators/Idempotent'

@SetupCollection('Roles')
class Role extends Model {

  static schema = schema

  constructor(doc) {
    super(doc)
    this.childIds = this.childIds || []
  }

  is(roleName) {
    return this.name === roleName
  }

  get hasAChild() {
    return this.children.length !== 0
  }

  @Idempotent
  get children() {
    return Role.find({ _id: { $in: this.childIds } }).fetch()
  }

  hasARole(roleName) {
    return this.is(roleName) || this.children.some(child => child.hasARole(roleName))
  }

  get hasAParent() {
    return !!this.parent
  }

  get isRoot() {
    return !this.hasAParent
  }

  get parent() {
    return Role.findOne({ childIds: this._id })
  }

  get root() {
    return ((this.isRoot && this.hasAChild) && this) || this.parent.root
  }

}

export default Role
