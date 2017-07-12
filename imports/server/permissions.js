import { Meteor } from 'meteor/meteor'
import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import Subject from '/imports/both/models/Subject'
import Degree from '/imports/both/models/Degree'
import Department from '/imports/both/models/Department'
import Role from '/imports/both/models/Role'
import Session from '/imports/both/models/Session'
import Activity from '/imports/both/models/Activity'
import ActivityType from '/imports/both/models/ActivityType'
import User from '/imports/both/models/User'
import Meeting from '/imports/both/models/Meeting'
import Notification from '/imports/both/models/Notification'
import AppSetting from '/imports/both/models/AppSetting'
import GradingTemplate from '/imports/both/models/GradingTemplate'
import GradeTransmutation from '/imports/both/models/GradeTransmutation'

/* const blacklist = {
  course: {
    faculty: []
  }
} */

/* const isAllowed = (doc, Model, allowedRoles, restrictedFields) => {
  const collection = Model.findOne({ _id: doc._id })
  const user = Meteor.user()
  const isAuthorized = allowedRoles.some(role => user.role.hasARole(role))
  console.log(isAuthorized)
//  console.log(doc)
//  console.log(collection)
} */

const isOwner = (userId, doc) => {
  return doc.userId === userId
}

const isTeacher = () => {
  const role = Meteor.user().roleName
  return role === 'faculty' || role === 'department head'
}

/* checks if current user is authorized to insert/update/remove based on role tree
e.g. user role: faculty, allowed roles: ['department head', 'secretary']; returns false */
const isAuthorized = (allowedRoles) => {
  const user = Meteor.user()
  if (!user) {
    return false
  }
  return allowedRoles.some(role => user.role.hasARole(role))
}
/* PS: allowedRoles elements: not necessary to include all roles, only the most child roles
  e.g. allowedRoles: ['faculty'], this includes the department head and dean, but not secretary */

Course.collection.allow({
  insert: () => isAuthorized(['department head', 'secretary']),
  update: (userId, doc) => {
    if (isTeacher()) {
      if (doc.laboratory) {
        return userId === doc.laboratory.instructor._id
      }
      return userId === doc.lecture.instructor._id
    }
    return isAuthorized(['faculty', 'secretary'])
  },
  remove: () => false,
})

Student.collection.allow({
  insert: () => isAuthorized(['department head', 'secretary']),
  update: () => isAuthorized(['faculty', 'secretary']),
  remove: () => false,
})

Subject.collection.allow({
  insert: () => isAuthorized(['secretary']),
  update: () => isAuthorized(['department head', 'secretary']),
  remove: () => false,
})

Degree.collection.allow({
  insert: () => isAuthorized(['dean']),
  update: () => isAuthorized(['dean']),
  remove: () => false,
})

Department.collection.allow({
  insert: () => isAuthorized(['dean']),
  update: () => isAuthorized(['dean']),
  remove: () => false,
})

Role.collection.allow({
  insert: () => isAuthorized(['dean']),
  update: () => isAuthorized(['dean']),
  remove: () => false,
})

Meeting.collection.allow({
  insert: () => isAuthorized(['dean']),
  update: () => isAuthorized(['dean']),
  remove: () => isAuthorized(['dean']),
})

Session.collection.allow({
  insert: () => isAuthorized(['faculty']),
  update: (userId, doc) => {
    if (isTeacher() && !doc.isLocked) {
      return isOwner(userId, doc)
    }
    return isAuthorized(['dean'])
  },
  remove: () => isAuthorized(['faculty']),
})

Activity.collection.allow({
  insert: () => isAuthorized(['faculty']),
  update: (userId, doc) => {
    if (isTeacher() && !doc.isLocked) {
      return isOwner(userId, doc)
    }
    return isAuthorized(['dean'])
  },
  remove: () => isAuthorized(['faculty']),
})

User.collection.allow({
  insert: () => isAuthorized(['secretary']),
  update: (userId, doc) => doc._id === userId || isAuthorized(['secretary']),
  remove: () => false,
})

AppSetting.collection.allow({
  insert: () => false,
  update: () => isAuthorized(['dean']),
  remove: () => false,
})

GradingTemplate.collection.allow({
  insert: () => isAuthorized(['faculty']),
  update: () => isAuthorized(['faculty']),
  remove: () => false,
})

GradeTransmutation.collection.allow({
  insert: () => isAuthorized(['dean']),
  update: () => isAuthorized(['dean']),
  remove: () => false,
})

Notification.collection.allow({
  insert: () => isAuthorized(['faculty', 'secretary']),
  update: (userId, doc) => userId === doc.authorId,
  remove: () => false,
})
