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
  laboratoryType: {
    type: String,
    allowedValues: [
      'Computational', 'With Hands-on', 'SE Subject',
    ],
    optional: true,
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
  teacherAssignedIds: {
    type: [String],
    optional: true,
  },
})
