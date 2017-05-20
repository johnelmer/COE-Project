import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import subjectSchema from './Subject.js'

const courseType = new SimpleSchema({
  time: {
    type: String,
  },
  room: {
    type: String,
  },
  instructor: {
    type: Object,
  },
  'instructor._id': {
    type: String,
  },
  'instructor.fullName': {
    type: String,
  },
  'instructor.idNumber': {
    type: String,
  },
})

export default new SimpleSchema({
  subject: {
    type: subjectSchema.pick('_id', 'name', 'courseNumber', 'credits', 'units', 'laboratoryType'),
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
  sessions: {
    type: [Object],
    optional: true,
  },
  'sessions.$._id': {
    type: String,
  },
  'sessions.$.date': {
    type: Date,
  },
  // TODO: specify fields
  studentIds: {
    type: [String],
    optional: true,
  },
  semester: {
    type: String,
  },
  schoolYear: {
    type: String,
  },
})
