import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import courseSchema from './Course'

export default new SimpleSchema({
  firstName: {
    type: String,
    min: 2,
  },
  lastName: {
    type: String,
    min: 2,
  },
  middleName: {
    type: String,
  },
  idNumber: {
    type: String,
  },
  gender: {
    type: String,
  },
  degree: {
    type: String,
    // allowedValues: degrees,
  },
  yearLevel: {
    type: Number,
  },
  birthday: {
    type: Date,
  },
  // TODO: regex
  contactNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  isGraduating: {
    type: Boolean,
  },
  guardian: {
    type: Object,
  },
  'guardian.fullName': {
    type: String,
  },
  'guardian.contactNumber': {
    type: String,
  },
  courses: {
    type: [courseSchema.pick('subject', 'lecture', 'laboratory', 'semester')],
    optional: true,
  },
})
