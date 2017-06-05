import { SimpleSchema } from 'meteor/aldeed:simple-schema'

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
    regEx: /^\d{2}\-\d{4}\-\d{2}$/,
  },
  gender: {
    type: String,
  },
  degree: {
    type: String,
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
  contactNumber: {
    type: String,
    regEx: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
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
    regEx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/,
  },
  father: {
    type: Object,
  },
  'father.fullName': {
    type: String,
  },
  'father.contactNumber': {
    type: String,
    regEx: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
  },
  mother: {
    type: Object,
  },
  'mother.fullName': {
    type: String,
  },
  'mother.contactNumber': {
    type: String,
    regEx: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
  },
  image: {
    // TODO
    type: Object,
    optional: true,
    blackbox: true,
  },
  courseIds: {
    type: [String],
    optional: true,
  },
})
