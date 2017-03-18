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
  studentIds: {
    type: [String],
    optional: true,
  },
  semester: {
    type: String,
  },
})
