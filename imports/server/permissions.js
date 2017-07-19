import { Meteor } from 'meteor/meteor'
import _ from 'underscore'
import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import Subject from '/imports/both/models/Subject'
import Degree from '/imports/both/models/Degree'
import Department from '/imports/both/models/Department'
import Role from '/imports/both/models/Role'
import Session from '/imports/both/models/Session'
import Activity from '/imports/both/models/Activity'
import User from '/imports/both/models/User'
import Meeting from '/imports/both/models/Meeting'
import Notification from '/imports/both/models/Notification'
import AppSetting from '/imports/both/models/AppSetting'
import GradingTemplate from '/imports/both/models/GradingTemplate'
import GradeTransmutation from '/imports/both/models/GradeTransmutation'

const whitelist = {
  activity: {
    faculty: ['totalScore', 'description', 'isLocked', 'records', 'userId'],
  },
  course: {
    faculty: ['lecture.sessions', 'laboratory.sessions', 'studentIds', 'gradingTemplateId'],
    secretary: ['subject', 'stubcode', 'lecture.instructor', 'lecture.time', 'lecture.room',
      'laboratory.instructor', 'laboratory.time', 'laboratory.room'],
  },
  gradingTemplate: {
    faculty: ['lecture', 'laboratory'],
  },
  session: {
    faculty: ['studentAttendances', 'activityIds', 'userId'], //userId needs to be omit because it already have a schema validation
  },
  student: {
    faculty: ['courseIds'],
    secretary: ['firstName', 'lastName', 'middleName', 'idNumber', 'gender', 'degree', 'yearLevel',
      'birthday', 'homeAddress', 'cityAddress', 'contactNumber', 'isGraduating', 'father', 'mother',
      'religion', 'citizenship'],
  },
  user: {
    faculty: ['username', 'password', 'contactNumber', 'civilStatus', 'address', 'birthday', 'religion', 'citizenship'],
  },
}

const isOwner = (userId, doc) => {
  return doc.userId === userId
}

const isDean = () => {
  return Meteor.user().roleName === 'dean'
}

const isTeacher = () => {
  const role = Meteor.user().roleName
  return role === 'faculty' || role === 'department head'
}

/* only allow $set as the modifier */
const isModifierAllowed = (modifier) => {
  const keys = Object.keys(modifier)
  return keys.length === 1 || keys[0] === '$set'
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

// const isRestricted = (doc, updatedDoc, blacklist) => {
//   return blacklist.some((field) => {
//     if (typeof field === 'object') {
//       return JSON.stringify(doc[field]) !== JSON.stringify(updatedDoc[field])
//     }
//     return doc[field] !== updatedDoc[field]
//   })
// }

/* ignore the allowed fields and compare the restricted fields if there are changes */
const isRestricted = (doc, updatedDoc, allowedFields) => {
  allowedFields.push('_id') // we need to push the _id in order to omit it
  return JSON.stringify(_.omit(doc, allowedFields))
    !== JSON.stringify(_.omit(updatedDoc, allowedFields))
}

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
  remove: () => isAuthorized(['dean']),
})

Student.collection.allow({
  insert: () => isAuthorized(['department head', 'secretary']),
  update: () => isAuthorized(['faculty', 'secretary']),
  remove: () => isAuthorized(['dean']),
})

Subject.collection.allow({
  insert: () => isAuthorized(['secretary']),
  update: () => isAuthorized(['department head', 'secretary']),
  remove: () => isAuthorized(['dean']),
})

Degree.collection.allow({
  insert: () => isAuthorized(['dean']),
  update: () => isAuthorized(['dean']),
  remove: () => isAuthorized(['dean']),
})

Department.collection.allow({
  insert: () => isAuthorized(['dean']),
  update: () => isAuthorized(['dean']),
  remove: () => isAuthorized(['dean']),
})

Role.collection.allow({
  insert: () => isAuthorized(['dean']),
  update: () => isAuthorized(['dean']),
  remove: () => isAuthorized(['dean']),
})

Meeting.collection.allow({
  insert: () => isAuthorized(['dean']),
  update: () => isAuthorized(['dean']),
  remove: () => isAuthorized(['dean']),
})

Session.collection.allow({
  insert: () => isAuthorized(['faculty']),
  update: (userId, doc) => {
    if (isTeacher()) {
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

GradingTemplate.collection.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Notification.collection.allow({
  insert: () => isAuthorized(['faculty', 'secretary']),
  update: (userId, doc) => userId === doc.authorId,
  remove: () => false,
})

Activity.collection.deny({
  update: (userId, doc, fields, modifier) => {
    if (isDean()) {
      return false
    } else if (isModifierAllowed(modifier)) {
      const updatedDoc = modifier.$set
      return isRestricted(doc, updatedDoc, whitelist.activity.faculty)
    }
    return true
  },
})

Course.collection.deny({
  update: (userId, doc, fields, modifier) => {
    if (isDean()) {
      return false
    } else if (isModifierAllowed(modifier)) {
      const updatedDoc = modifier.$set
      return (isTeacher()) ? isRestricted(doc, updatedDoc, whitelist.course.faculty)
            : isRestricted(doc, updatedDoc, whitelist.course.secretary)
    }
    return true
  },
})

GradingTemplate.collection.deny({
  update: (userId, doc, fields, modifier) => {
    if (isDean()) {
      return false
    } else if (isModifierAllowed(modifier)) {
      const updatedDoc = modifier.$set
      return isRestricted(doc, updatedDoc, whitelist.gradingTemplate.faculty)
    }
    return true
  },
})

Session.collection.deny({
  update: (userId, doc, fields, modifier) => {
    if (isDean()) {
      return false
    } else if (isModifierAllowed(modifier)) {
      const updatedDoc = modifier.$set
      return isRestricted(doc, updatedDoc, whitelist.session.faculty)
    }
    return true
  },
})

Student.collection.deny({
  update: (userId, doc, fields, modifier) => {
    if (isDean()) {
      return false
    } else if (isModifierAllowed(modifier)) {
      const updatedDoc = modifier.$set
      const userRole = Meteor.user().roleName
      if (userRole === 'secretary') {
        return isRestricted(doc, updatedDoc, whitelist.student.secretary)
      } else if (userRole === 'department head') {
        return false
      }
      return isRestricted(doc, updatedDoc, whitelist.student.faculty)
    }
    return true
  },
})

User.collection.deny({
  update: (userId, doc, fields, modifier) => {
    if (isDean()) {
      return false
    } else if (isModifierAllowed(modifier)) {
      const updatedDoc = modifier.$set
      return isRestricted(doc, updatedDoc, whitelist.user.faculty)
    }
    return true
  },
})
