import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'

@SetupCollection('Students')
class Student extends Model {
  // TODO
  static schema = {}

  enrollACourse(course) {
    const courseDoc = course
    delete courseDoc.sessions
    delete courseDoc.students
    this.courses.push(courseDoc)
  }
}

export default Student
