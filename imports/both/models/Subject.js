import _ from 'underscore'

import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Subject'

import Model from './Model'
import Course from './Course'

@SetupCollection('Subjects')
class Subject extends Model {

  static schema = schema

  assignTeacher(teacher) {
    const isTeacherExist = this.teachersAssigned.findByIndex((teacherDoc) => {
      return teacherDoc._id === teacher._id
    }) !== -1
    if (!isTeacherExist) {
      this.teachersAssigned.push({
        _id: teacher._id,
        firstName: teacher.firstName,
        lastName: teacher.lastname,
      })
    }
  }

  removeTeacher(teacherId) {
    this.removeObjectFromArray('teachersAssigned', '_id', teacherId)
  }
/*
  generateCourse(doc) {
    const course = new Course({
      subject: _.pick(this, '_id', 'name', 'courseNumber', 'credits', 'units'),
      stubcode: doc.stubcode,
      lecture: doc.lecture,
      laboratory: doc.laboratory,
      sessions: [],
      students: [],
      semester: doc.semester,
    })
    course.save((err) => {
      if (err) { throw new Error('Failed to generate course') }
    })
  }
*/
}

export default Subject
