import Model from './Model'

class Role extends Model {
  static setSchema() {
    this.constructor.attachSchema(new SimpleSchema({
      role: {
        type: String,
      },
      children: {
        type: [String],
      },
    }))
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

  get ancestors() {
    return Role.find({ childIds: { $elemMatch: { $in: [this._id] } } }).fetch()
  }
}
