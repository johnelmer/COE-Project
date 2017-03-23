import { Meteor } from 'meteor/meteor'
import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import Subject from '/imports/both/models/Subject'
import Degree from '/imports/both/models/Degree'

Course.collection.allow({
  insert: () => true,
  update: () => true,
  remove: () => false,
})

Student.collection.allow({
  insert: userId => userId,
  update: userId => userId,
  remove: userId => userId,
})

Subject.collection.allow({
  insert: userId => userId,
  update: userId => userId,
  remove: userId => userId,
})

Degree.collection.allow({
  insert: () => true,
  update: () => false,
  remove: userId => userId,
})

Meteor.users.allow({
  insert: () => true,
  update: (userId, user) => user._id === userId,
  remove: () => false,
})
