import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import courseSchema from './Course'

export default new SimpleSchema({
  firstName: {
    type: String,
    min: 2,
    optional: true,
  },
  lastName: {
    type: String,
    min: 2,
    optional: true,
  },
  middleName: {
    type: String,
    optional: true,
  },
  idNumber: {
    type: String,
    optional: true,
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
    optional: true,
  },
  birthday: {
    type: Date,
  },
  homeAddress: {
    type: String,
  },
  cityAddress: {
    type: String,
  },
  // TODO: regex
  contactNumber: {
    type: String,
  },
  isGraduating: {
    type: Boolean,
    optional: true,
  },
  religion: {
    type: String,
    optional: true,
  },
  citizenship: {
    type: String,
    optional: true,
  },
  email: {
    // TODO: regex
    type: String,
    optional: true,
  },
  father: {
    type: Object,
  },
  'father.fullName': {
    type: String,
  },
  'father.contactNumber': {
    // TODO: regex
    type: String,
  },
  mother: {
    type: Object,
  },
  'mother.fullName': {
    type: String,
  },
  'mother.contactNumber': {
    // TODO: regex
    type: String,
  },
  image: {
    // TODO
    type: Object,
    optional: true,
    blackbox: true,
  },
  courses: {
    type: [courseSchema.pick('subject', 'lecture', 'laboratory', 'semester')],
    optional: true,
  },
})
