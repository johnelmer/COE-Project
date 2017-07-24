import _ from 'underscore'

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
    return Course.find({ _id: { $in: this.courseIds } }).fetch()
  }

  get coursesGrades() {
    return this.courses.map(course => course.getStudentRecords(this))
  }

  get failedCourses() {
    return this.coursesGrades.filter(courseGrade => courseGrade.finalRating === '5.0')
  }

  get numberOfFailures() {
    return this.failedCourses.length
  }

  get degreeAndYear() {
    return `${this.degree} - ${this.yearLevel}`
  }

  incrementYearLevel() {
    if (this.yearLevel === 5) {
      this.yearLevel += 1
    }
  }
}

export default Student
