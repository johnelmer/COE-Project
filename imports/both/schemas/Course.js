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
    type: subjectSchema.pick('_id', 'name', 'courseNumber', 'credits', 'units', 'laboratoryType'),
  },
  stubcode: {
    type: Number,
    optional: true,
  },
  lecture: {
    type: courseType,
  },
  laboratory: {
    type: courseType,
    optional: true,
  },
  // TODO: specify fields
  studentIds: {
    type: [String],
    optional: true,
  },
  semester: {
    type: String,
    optional: true,
  },
  schoolYear: {
    type: String,
    optional: true,
  },
  gradingTemplate: {
    type: Object,
    optional: true,
  },
  'gradingTemplate._id': {
    type: String,
  },
  'gradingTemplate.isApproved': {
    type: Boolean,
  },
})
