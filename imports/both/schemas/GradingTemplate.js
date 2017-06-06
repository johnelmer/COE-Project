import { SimpleSchema } from 'meteor/aldeed:simple-schema'

const activityType = new SimpleSchema({
  name: {
    type: String,
  },
  percentage: {
    type: Number,
  },
  isMultiple: {
    type: Boolean,
  },
})

const classType = new SimpleSchema({
  percentage: {
    type: Number,
  },
  activityTypes: {
    type: [activityType],
  },
})

export default new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['Semester Term', 'Summer Term'],
  },
  description: {
    type: String,
    optional: true,
  },
  isDefault: {
    type: Boolean,
  },
  lecture: {
    type: classType,
  },
  laboratory: {
    type: classType,
    optional: true,
  },
  'laboratory.type': {
    type: String,
    allowedValues: [
      'Computational', 'With Hands-on', 'SE Subject',
    ],
  },
  passingPercentage: {
    type: Number,
  },
  courseIds: {
    type: [String],
  },
})
