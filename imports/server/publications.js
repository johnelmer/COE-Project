import { Meteor } from 'meteor/meteor'
import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import Subject from '/imports/both/models/Subject'
import Degree from '/imports/both/models/Degree'

Meteor.publish('courses', () => Course.find())

Meteor.publish('students', () => Student.find())

Meteor.publish('subjects', () => Subject.find())

Meteor.publish('degrees', () => Degree.find())
