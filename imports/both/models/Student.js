import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Student'

import Model from './Model'

@SetupCollection('Students')
class Student extends Model {

  static schema = schema

  enrollACourse(course) {
    const courseDoc = course
    delete courseDoc.sessions
    delete courseDoc.students
    this.courses.push(courseDoc)
  }

  get fullName() {
    return `${this.lastName}, ${this.firstName} ${this.middleName}.`
  }
}

export default Student
