import { Meteor } from 'meteor/meteor'
import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import Subject from '/imports/both/models/Subject'

Meteor.publish('courses', () => Course.find())

Meteor.publish('students', () => Student.find())

Meteor.publish('subjects', () => Subject.find())
