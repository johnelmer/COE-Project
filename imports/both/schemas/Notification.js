import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  userIds: {
    type: [String],
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
