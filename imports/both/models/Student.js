import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Student'

import Model from './Model'
import Course from './Course'

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
    return `${this.lastName}, ${this.firstName} ${this.middleName.slice(0, 1)}.`
  }

  get courses() {
    return Course.find({ _id: { $in: this.courseIds } })
  }

  get selectedClassRecord() {

  }
}

export default Student
