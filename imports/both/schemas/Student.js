import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  firstName: {
    type: String,
    min: 1,
    optional: true,
    regEx: /^[a-zA-Z\d\- ]{1,}$/,
  },
  lastName: {
    type: String,
    min: 2,
    optional: true,
    regEx: /^[a-zA-Z\d\- ]{2,}$/,
  },
  middleName: {
    type: String,
    optional: true,
    regEx: /^[a-zA-Z\d\- ]{2,}$/,
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
    optional: true,
    regEx: /^[a-zA-Z\d\-\., ]{2,}$/,
  },
  cityAddress: {
    type: String,
    optional: true,
    regEx: /^[a-zA-Z\d\-\., ]{2,}$/,
  },
  contactNumber: {
    type: String,
    optional: true,
    regEx: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
  },
  isGraduating: {
    type: Boolean,
    optional: true,
  },
  religion: {
    type: String,
    optional: true,
    defaultValue: 'Roman Catholic',
  },
  citizenship: {
    type: String,
    optional: true,
    defaultValue: 'Filipino',
  },
  email: {
    type: String,
    optional: true,
    regEx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/,
  },
  father: {
    type: Object,
  },
  'father.fullName': {
    type: String,
    regEx: /^[a-zA-Z\d\-\., ]{2,}$/,
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
    regEx: /^[a-zA-Z\d\-\., ]{2,}$/,
  },
  'mother.contactNumber': {
    type: String,
    regEx: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
  },
  image: {
    // TODO: Image upload
    type: Object,
    optional: true,
    blackbox: true,
  },
  courseIds: {
    type: [String],
    optional: true,
  },
})
