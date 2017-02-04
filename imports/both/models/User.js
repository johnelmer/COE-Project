import _ from 'underscore'
import { Accounts } from 'meteor/accounts-base'

import Model from './Model'
import SetupAccount from '../decorators/SetupAccount'
import Schemas from '../Schemas'

@SetupAccount
class User extends Model {

  static schema = Schemas.user

  // teacher
  assignSubject(subject) {
    const subjectDoc = subject
    delete subjectDoc.courses
    delete subjectDoc.teachersAssigned
    this.profile.subjectsAssigned.push(subjectDoc)
  }
  // teacher
  removeSubjectAssignment(subjectId) {
    this.removeObjectFromArray('subjects', '_id', subjectId)
  }
  // teacher
  removeCourse(courseId) {
    this.removeObjectFromArray('courses', '_id', courseId)
  }
  // teacher
  addCourse(course) {
    const courseDoc = course
    const subject = course.subject
    delete subject.courses
    delete subject.teachersAssigned
    courseDoc.subject = subject
    delete courseDoc.sessions
    delete courseDoc.students
    this.profile.courses.push(courseDoc)
  }

  save(callback) {
    if (this._id) {
      return this.constructor.update(this._id, { $set: this.doc }, {}, callback)
    }
    return Accounts.createUser(this.doc, callback)
  }

}

export default User
