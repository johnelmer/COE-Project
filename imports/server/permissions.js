import { Meteor } from 'meteor/meteor'
import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import Subject from '/imports/both/models/Subject'
import Degree from '/imports/both/models/Degree'
import Department from '/imports/both/models/Department'
import Role from '/imports/both/models/Role'
import Session from '/imports/both/models/Session'
import Activity from '/imports/both/models/Activity'

// To be update
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
  insert: () => true,
  update: userId => userId,
  remove: userId => userId,
})

Degree.collection.allow({
  insert: () => true,
  update: () => false,
  remove: userId => userId,
})

Department.collection.allow({
  insert: () => true,
  update: () => false,
  remove: userId => userId,
})

Role.collection.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Session.collection.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Activity.collection.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Meteor.users.allow({
  insert: () => true,
  update: (userId, user) => user._id === userId,
  remove: () => false,
})
