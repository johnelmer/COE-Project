import { SimpleSchema } from 'meteor/aldeed:simple-schema'

const gpa = new SimpleSchema({
  min: {
    type: Number,
    decimal: true,
  },
  max: {
    type: Number,
    decimal: true,
  },
  equivalent: {
    type: String,
  },
})

export default new SimpleSchema({
  name: {
    type: String,
  },
  passingPercentage: {
    type: Number,
  },
  gpaList: {
    type: [gpa],
  },
})
