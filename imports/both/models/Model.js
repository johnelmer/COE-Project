import _ from 'underscore'

class Model {
  constructor(doc) {
    if (this.constructor.name === 'Model') {
      throw new Error('Model is abstract, and should not be instantiated.')
    }

    _(this).extend(doc)
  }

  // I can't seem to make this work using functional programming, on the
  // decorator -- gets a 'cannot call `find` on undefined', probably because
  // the collection property of the Mongo.Collection instance is not
  // yet instantiated
  //
  // Good ol' delegation it is then!
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
    if(this._id){
      return this.constructor.update(this._id, { $set : this.doc }, {}, callback)
    }else{
      return this.constructor.insert(this.doc, callback)
    }
  }

}

export default Model
