import Model from './Model'

class Course extends Model {

  get list(){ //not yet async, to be fix
    const courses = Course.find().fetch()
    let list = []
    courses.forEach(course => list.push(course.name))
    return list
  }

  static setSchema() {
    this.constructor.attachSchema(new SimpleSchema({
      name: {
        type: String
      }
    }))
  }
}

export default Course