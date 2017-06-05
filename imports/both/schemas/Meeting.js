import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  title: {
    type: String,
  },
  attendeeIds: {
    type: [String],
    optional: true,
  },
  schedule: {
    type: Object,
  },
  'schedule.time' : {
    type: Date,
  },
  'schedule.date' : {
    type: Date,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
})
