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


}
