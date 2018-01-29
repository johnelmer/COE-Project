import { SimpleSchema } from 'meteor/aldeed:simple-schema'

SimpleSchema.messages({
  alreadyExist: '[label] already exist',
  'regEx idNumber': [{
    msg: 'Please correctly encode ID number with dashes',
  }],
  'regEx email': [{
    msg: 'Email is not a valid format',
  }],
  'regEx firstName': [{
    msg: 'First Name cannot contain special characters',
  }],
  'regEx contactNumber': [{
    msg: 'Please review the contact number you encoded',
  }],
  'minString firstName': 'First Name must be at least 1 chracter',
})

export default new SimpleSchema({
  firstName: {
    type: String,
    min: 1,
    label: 'First Name',
    // regEx: /^[a-zA-Z\d\-ñÑ ]$/,
  },
  lastName: {
    type: String,
    min: 2,
    label: 'Last Name',
    // regEx: /^[a-zA-Z\d\-ñÑ ]$/,
  },
  middleName: {
    type: String,
    label: 'Middle Name',
    optional: true,
    // regEx: /^[a-zA-Z\d\- ]$/,
  },
  idNumber: {
    type: String,
    unique: true,
    label: 'ID Number',
    regEx: /^\d{2}\-\d{4}\-\d{2}$/,
  },
  gender: {
    type: String,
  },
  degree: {
    type: String,
    optional: true,
  },
  yearLevel: {
    type: Number,
    optional: true,
  },
  birthday: {
    optional: true,
    type: Date,
  },
  homeAddress: {
    type: String,
    regEx: /^[a-zA-Z\d\-\., ]$/,
    optional: true,
  },
  cityAddress: {
    type: String,
    regEx: /^[a-zA-Z\d\-\., ]$/,
    optional: true,
  },
  contactNumber: {
    type: String,
    regEx: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
    optional: true,
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
    optional: true,
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
    optional: true,
  },
  'mother.fullName': {
    type: String,
    regEx: /^[a-zA-Z\d\-\., ]{2,}$/,
  },
  'mother.contactNumber': {
    type: String,
    regEx: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
  },
  nameSuffix: {
    type: String,
    defaultValue: '',
    optional: true,
  },
  image: {
    type: Object,
    defaultValue: {},
    optional: true,
    blackbox: true,
  },
  courseIds: {
    type: [String],
    optional: true,
  },
})
