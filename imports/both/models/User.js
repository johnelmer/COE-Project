import _ from 'underscore'
import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'

import Model from './Model'
import Role from './Role'
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
    this.subjectsAssigned.push(subjectDoc)
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
    this.courses.push(courseDoc)
  }

  get role() {
    return Role.findOne({ roleName: this.roleName })
  }

  save(callback) {
    if (this._id) {
      // TODO: Use meteor.call, specify the docs to be update
      return this.constructor.update(this._id, { $set: this.doc }, {}, callback)
    }
    return Meteor.call('createNewUser', this.doc)
  }

}

export default User
