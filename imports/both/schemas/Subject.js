import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  name: {
    type: String,
    min: 2,
  },
  courseNumber: {
    type: String,
  },
  credits: {
    type: Number,
  },
  units: {
    type: Number,
  },
  isOffered: {
    type: Boolean,
    optional: true,
    // defaultValue: true,
  },
  courseIds: {
    type: [String],
    optional: true,
  },
  teachersAssignedIds: {
    type: [String],
    optional: true,
  },
})
