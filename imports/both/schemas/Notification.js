import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Meteor } from 'meteor/meteor'

export default new SimpleSchema({
  userIds: {
    type: [String],
  },
  authorId: {
    type: String,
    autoValue: function () {
      if (this.isInsert) {
        return Meteor.userId()
      }
      this.unset()
    },
  },
  title: {
    type: String,
  },
  content: {
    type: Object,
  },
  'content.header': {
    type: String
  },
  'content.body': {
    type: String
  },
  date: {
    type: Date,
  }
})
