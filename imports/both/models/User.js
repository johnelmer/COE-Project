import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'

import Model from './Model'
import Role from './Role'
import Course from './Course'
import AppSetting from './AppSetting'
import SetupAccount from '../decorators/SetupAccount'
import schema from '../schemas/User'

@SetupAccount
class User extends Model {

  static schema = schema

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

  get courses() {
    const setting = AppSetting.findOne()
    const schoolYear = setting.currentSchoolYear
    const semester = setting.currentSemester
    return Course.find({ _id: { $in: this.courseIds }, schoolYear: schoolYear, semester: semester }).fetch()
  }

  get role() {
    return Role.findOne({ name: this.roleName })
  }

  get fullName() {
    return `${this.lastName}, ${this.firstName} ${this.middleName.slice(0, 1)}.`
  }

  get isRoot() {
    const { isRoot } = this.role
    return isRoot
  }

  hasARole(roleName) {
    return this.role.hasARole(roleName)
  }

  save(callback) {
    if (this._id) {
      const doc = this.doc
      doc._id = this._id
      return Meteor.call('updateUser', doc, callback)
    }
    return Meteor.call('createNewUser', this.doc, callback)
  }
}

export default User
