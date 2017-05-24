import { SimpleSchema } from 'meteor/aldeed:simple-schema'

const records = new SimpleSchema({
  studentId: {
    type: String,
  },
  score: {
    type: Number,
    optional: true,
  },
})

export default new SimpleSchema({
  type: {
    type: String,
  },
  description: {
    type: String,
    optional: true,
  },
  totalScore: {
    type: Number,
  },
  records: {
    type: [records],
    optional: true,
  },
  sessionId: {
    type: String,
  },
  isLocked: {
    type: Boolean,
  },
})
