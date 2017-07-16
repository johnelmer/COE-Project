import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Meteor } from 'meteor/meteor'

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
  userId: {
    type: String,
    autoValue: function () {
      if (this.isInsert) {
        return Meteor.userId()
      }
      this.unset()
    },
  },
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
