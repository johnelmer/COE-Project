import _ from 'underscore'

import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Subject'

import Model from './Model'
import Course from './Course'
import AppSetting from './AppSetting'

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

  getNewCourseId(doc, callback) {
    const setting = AppSetting.findOne()
    const subject = _.pick(this, '_id', 'name', 'courseNumber', 'credits', 'units')
    if (this.laboratoryType) {
      subject.laboratoryType = this.laboratoryType
    }
    const courseId = new Course({
      subject: subject,
      stubcode: doc.stubcode,
      lecture: doc.lecture,
      laboratory: doc.laboratory,
      sessions: [],
      studentIds: [],
      semester: setting.currentSemester,
      schoolYear: setting.currentSchoolYear,
    }).save(callback)
    this.courseIds.push(courseId)
    return courseId
  }
}

export default Subject
