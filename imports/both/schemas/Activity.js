import { SimpleSchema } from 'meteor/aldeed:simple-schema'

const records = new SimpleSchema({
  studentId: {
    type: String,
  },
  score: {
    type: Number,
  },
})

export default new SimpleSchema({
  type: {
    type: String,
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
})
