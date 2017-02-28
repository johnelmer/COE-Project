import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import subjectSchema from './Subject.js'

const courseType = new SimpleSchema({
  time: {
    type: String,
  },
  room: {
    type: String,
  },
  instructorId: {
    type: String,
  },
})

export default new SimpleSchema({
  subject: {
    type: subjectSchema.pick('_id', 'name', 'courseNumber', 'credits', 'units'),
  },
  stubcode: {
    type: String,
  },
  lecture: {
    type: courseType,
  },
  laboratory: {
    type: courseType,
    optional: true,
  },
  sessionIds: {
    type: [String],
    optional: true,
  },
  // TODO: specify fields
  students: {
    type: [Object],
    optional: true,
  },
  'students.$._id': {
    type: String,
  },
  'students.$.firstName': {
    type: String,
  },
  'students.$.middleName': {
    type: String,
  },
  'students.$.lastName': {
    type: String,
  },
  'students.$.idNumber': {
    type: String,
  },
  'students.$.degree': {
    type: String,
  },
  'students.$.yearLevel': {
    type: Number,
  },
  semester: {
    type: String,
  },
})
