import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  courseId: {
    type: String,
  },
  attendance: {
    type: Object,
    optional: true,
  },
  'attendance.presents': {
    type: [String],
    optional: true,
  },
  'attendance.lates': {
    type: [String],
    optional: true,
  },
  'attendance.absents': {
    type: [String],
    optional: true,
  },
  'attendance.excuses': {
    type: [String],
    optional: true,
  },
  activityIds: {
    type: [String],
    optional: true,
  },
  date: {
    type: Date,
  },
})
