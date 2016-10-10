import _ from 'underscore'

// to be promisified.

class Model {
  constructor(doc) {
    if (this.constructor.name === 'Model') {
      throw new Error('Model is abstract, and should not be instantiated.')
    }

    _(this).extend(doc)
    // setup()
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

  get doc(){
    return _(this).omit('_id')
  }

  save(callback){
    if(this._id) {
      return this.constructor.update(this._id, { $set : this.doc }, {}, callback)
    } else {
      return this.constructor.insert(this.doc, callback)
    }
  }

  // setup(){}
}

export default Model
