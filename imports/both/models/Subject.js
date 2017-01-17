import _ from 'underscore'

import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'
import Course from './Course'

@SetupCollection('Subjects')
class Subject extends Model {

  static schema = Schemas.subject

  assignTeacher(teacher) {
    this.teachersAssigned.push({
      _id: teacher._id,
      firstName: teacher.firstName,
      lastName: teacher.lastname,
    })
  }

  removeTeacher(teacherId) {
    this.removeObjectFromArray('teachersAssigned', '_id', teacherId)
  }

  generateCourse(doc) {
    const course = new Course({
      suject: _.pick(this, '_id', 'name', 'courseNumber', 'credits', 'units'),
      stubcode: doc.stubcode,
      lecture: doc.lecture,
      laboratory: doc.laboratory,
      semester: doc.semester,
    })
    course.save((err) => {
      if (err) { throw new Error('Failed to generate course') }
    })
  }
}

export default Subject
