import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Meteor } from 'meteor/meteor'

const attendance = new SimpleSchema({
  studentId: {
    type: String,
  },
  type: {
    type: String,
    allowedValues: [
      'Present',
      'Late',
      'Absent',
      'Excuse',
    ],
  },
})

export default new SimpleSchema({
  courseId: {
    type: String,
  },
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
    allowedValues: ['lecture', 'laboratory'],
  },
  studentAttendances: {
    type: [attendance],
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
