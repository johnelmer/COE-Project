import _ from 'underscore'

import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'
import Course from './Course'

@SetupCollection('Subjects')
class Subject extends Model {

  static schema = Schemas.subject

  assignTeacher(teacherId) {
    const teacherIds = this.teacherAssignedIds
    const isTeacherExist = teacherIds.some(id => id === teacherId)
    if (!isTeacherExist) {
      this.teachersAssignedIds.push(teacherId)
    }
  }

  removeTeacher(teacherId) {
    const teacherIds = this.teacherAssignedIds
    const index = teacherIds.findIndex(id => id === teacherId)
    if (index !== -1) {
      teacherIds.splice(index, 1)
    }
  }
/*
  generateCourse(doc) {
    return new Course({
      subject: _.pick(this, '_id', 'name', 'courseNumber', 'credits', 'units'),
      stubcode: doc.stubcode,
      lecture: doc.lecture,
      laboratory: doc.laboratory,
      sessions: [],
      students: [],
      semester: doc.semester,
    })
*/
}

export default Subject
