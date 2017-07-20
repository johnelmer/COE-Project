import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import subjectSchema from './Subject.js'

const courseType = new SimpleSchema({
  time: {
    type: String,
    optional: true,
  },
  room: {
    type: String,
    optional: true,
  },
  instructor: {
    type: Object,
    optional: true,
  },
  'instructor._id': {
    type: String,
    optional: true,
  },
  'instructor.fullName': {
    type: String,
  },
  'instructor.idNumber': {
    type: String,
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
})

export default new SimpleSchema({
  subject: {
    type: subjectSchema.pick('name', 'courseNumber', 'units', 'laboratoryType'),
  },
  stubcode: {
    type: Number,
    optional: true,
    // unique: true,
  },
  lecture: {
    type: courseType,
  },
  laboratory: {
    type: courseType,
    defaultValue: {},
  },
  // TODO: specify fields
  studentIds: {
    type: [String],
    defaultValue: [],
  },
  semester: {
    type: String,
    optional: true,
  },
  schoolYear: {
    type: String,
    optional: true,
  },
  gradingTemplateId: {
    type: String,
    optional: true,
  },
})
