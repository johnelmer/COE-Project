import SetupCollection from '../decorators/SetupCollection'

import Model from './Model'

@SetupCollection('Students')
class Student extends Model {
  /* Please add schema for this collection */
  static schema = {}

  enrollACourse(course) {
    const courseDoc = course
    delete courseDoc.sessions
    delete courseDoc.students
    this.courses.push(courseDoc)
  }
}

export default Student
