import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  title: {
    type: String,
  },
  attendees: {
    type: [String]
  },
  time : {
    type: Date,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
})
