import _ from 'underscore'
import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'

import Model from './Model'
import Role from './Role'
import Course from './Course'
import SetupAccount from '../decorators/SetupAccount'
import Schemas from '../Schemas'

@SetupAccount
class User extends Model {

  static schema = Schemas.user

  // teacher
  removeCourse(courseId) {
    const courseIds = this.courseIds
    const index = courseIds.findIndex(id => id === courseId)
    if (index !== -1) {
      courseIds.splice(index, 1)
    }
  }
  // teacher
  addCourse(courseId) {
    const courseIds = this.courseIds
    const isCourseExist = courseIds.some(id => id === courseId)
    if (!isCourseExist) {
      courseIds.push(courseId)
    }
  }

  get courses() {
    return Course.find({ $or: [{ 'lecture.instructorId': this._id }, { 'laboratory.instructorId': this._id }] }).fetch()
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
