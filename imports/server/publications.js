import { Meteor } from 'meteor/meteor'
import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import Subject from '/imports/both/models/Subject'
import Degree from '/imports/both/models/Degree'
import User from '/imports/both/models/User'
import Role from '/imports/both/models/Role'
import Activity from '/imports/both/models/Activity'
import Session from '/imports/both/models/Session'

Meteor.publish('courses', () => Course.find())

Meteor.publish('students', () => Student.find())

Meteor.publish('subjects', () => Subject.find())

Meteor.publish('degrees', () => Degree.find())

Meteor.publish('teachers', () => User.find({ roleName: 'teacher' }))

Meteor.publish('roles', () => Role.find())

Meteor.publish('activities', () => Activity.find())

Meteor.publish('sessions', () => Session.find())
