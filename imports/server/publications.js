import { Meteor } from 'meteor/meteor'
import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import Subject from '/imports/both/models/Subject'
import Degree from '/imports/both/models/Degree'
import Department from '/imports/both/models/Department'
import User from '/imports/both/models/User'
import Role from '/imports/both/models/Role'
import Activity from '/imports/both/models/Activity'
import ActivityType from '/imports/both/models/ActivityType'
import Session from '/imports/both/models/Session'
import AppSetting from '/imports/both/models/AppSetting'
import GradingTemplate from '/imports/both/models/GradingTemplate'
import Meeting from '/imports/both/models/Meeting'

Meteor.publish('courses', () => Course.find())

Meteor.publish('students', () => Student.find({}, { sort: { lastName: 1 } }))

Meteor.publish('students-basic-infos', () => Student.find({}, { fields: { firstName: 1, middleName: 1, lastName: 1 } }))

Meteor.publish('subjects', () => Subject.find())

Meteor.publish('degrees', () => Degree.find())

Meteor.publish('departments', () => Department.find())

Meteor.publish('teachers', () => User.find({}, { fields: { firstName: 1, middleName: 1, lastName: 1, roleName: 1, courseIds: 1 } }))

Meteor.publish('users', () => User.find({}, { fields: { services: 0 } }))

Meteor.publish('roles', () => Role.find())

Meteor.publish('activities', () => Activity.find())

Meteor.publish('activity-types', () => ActivityType.find({}, { fields: { name: 1 } }))

Meteor.publish('sessions', () => Session.find())

Meteor.publish('settings', () => AppSetting.find())

Meteor.publish('grading-templates', () => GradingTemplate.find())

Meteor.publish('meetings', () => Meeting.find())
