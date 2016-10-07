import _ from 'underscore'

class User {

  constructor(doc) {
    if (this.constructor.name === 'User') {
      throw new Error('User is abstract, and should not be instantiated.')
    }
    _(this).extend(doc)
  }

  get doc() {
    return _(this).omit('_id')
  }

  static find(selector = {}, options = {}) {
    return this.collection.find(selector, options)
  }

  static findOne(selector = {}, options = {}) {
    return this.collection.findOne(selector, options)
  }

  static insert(doc, callback) {
    return this.collection.insert(doc, callback)
  }

  static update(selector, modifier) {
    return this.collection.update(selector, modifier)
  }

  static remove(selector = {}, callback) {
    return this.collection.remove(selector, callback)
  }

  static save() {
    if (this._id) {
      return this.constructor.update(this._id, { $set: this.doc })
    }
    return this.constructor.insert(this.doc)
  }

}

export default User
