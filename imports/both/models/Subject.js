import _ from 'underscore'

import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Subject'

import Model from './Model'
import Course from './Course'

@SetupCollection('Subjects')
class Subject extends Model {

  static schema = schema

  assignTeacher(teacher) {
    const isTeacherExist = this.teachersAssigned.some(teacherDoc => teacherDoc._id === teacher._id)
    if (!isTeacherExist) {
      this.teachersAssignedIds.push(teacher._id)
    }
  }

  removeTeacher(teacherId) {
    const teacherIds = this.teacherIds
    const index = teacherIds.findIndex(id => id === teacherId)
    if (index !== 1) {
      teacherIds.splice(index, 1)
    }
  }

  getNewCourse(doc, callback) {
    const subject = _.pick(this, '_id', 'name', 'courseNumber', 'credits', 'units')
    if (this.laboratyType) {
      subject.laboratyType = this.laboratyType
    }
    const courseId = new Course({
      subject: subject,
      stubcode: doc.stubcode,
      lecture: doc.lecture,
      laboratory: doc.laboratory,
      sessions: [],
      studentIds: [],
      semester: doc.semester,
      schoolYear: doc.schoolYear,
    }).save(callback)
    this.courseIds.push(courseId)
    return Course.findOne({ _id: courseId })
  }
}

export default Subject
