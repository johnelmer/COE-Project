import Model from './Model'

import SetupCollection from '../decorators/SetupCollection'
import Idempotent from '../decorators/Idempotent'

import Schema from '../Schemas'

@SetupCollection('Roles')
class Role extends Model {

  static schema = Schema.role

  constructor(doc) {
    super(doc)
    this.childIds = this.childIds || []
  }

  @Idempotent
  get children() {
    return Role.find({ _id: { $in: this.childIds } }).fetch()
  }

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
