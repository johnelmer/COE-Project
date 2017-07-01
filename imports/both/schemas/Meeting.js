import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  createdAt: {
    type: Date,
  },
  title: {
    type: String,
  },
  attendeeIds: {
    type: [String],
    optional: true,
  },
  schedule: {
    type: Date,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  filename: {
    type: String,
    optional: true,
  },
})
