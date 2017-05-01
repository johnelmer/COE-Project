import _ from 'underscore'

// to be promisified.

class Model {
  constructor(doc) {
    if (this.constructor.name === 'Model') {
      throw new Error('Model is abstract, and should not be instantiated.')
    }

    _(this).extend(doc)
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

  static update(selector, modifier, options, callback) {
    return this.collection.update(selector, modifier, options, callback)
  }

  static remove(selector = {}, callback) {
    return this.collection.remove(selector, callback)
  }

  get doc() {
    return _(this).omit('_id')
  }

  save(callback) {
    if (this._id) {
      return this.constructor.update(this._id, { $set: this.doc }, {}, callback)
    }
    return this.constructor.insert(this.doc, callback)
  }

  removeObjectFromArray(arrayField, key, val) {
    const field = this[arrayField]
    if (field && field instanceof Array) {
      const index = field.findIndex((doc) => {
        if (typeof doc !== 'object') {
          throw new Error('Not an object values!')
        }
        return doc[key] === val
      })
      if (index === -1) {
        throw new Error('Object not found!')
      }
      field.splice(index, 1)
    }
  }

  getFilteredObjectsFromArray(arrayField, key, val) {
    const field = this[arrayField]
    if (field && field instanceof Array) {
      return field.filter((doc) => {
        if (typeof doc !== 'object') {
          throw new Error('Not an object values!')
        }
        return doc[key] === val
      })
    }
    return []
  }
}

export default Model
