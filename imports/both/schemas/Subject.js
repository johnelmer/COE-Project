import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  name: {
    type: String,
    min: 2,
    optional: true,
  },
  courseNumber: {
    type: String,
  },
  credits: {
    type: Number,
    optional: true,
  },
  units: {
    type: Number,
    optional: true,
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
