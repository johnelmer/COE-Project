import { SimpleSchema } from 'meteor/aldeed:simple-schema'

SimpleSchema.messages({
  alreadyExist: '[label] already exist',
})

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
    regEx: /^[a-zA-Z\d\-ñÑ ]{2,}$/,
  },
  middleName: {
    type: String,
    optional: true,
    regEx: /^[a-zA-Z\d\- ]{2,}$/,
  },
  idNumber: {
    type: String,
    unique: true,
    label: "Id Number",
    regEx: /^\d{2}\-\d{4}\-\d{2}$/,
    // NOTE: Should not duplicate
    // custom: function () {
    //   const Student = require('/imports/both/models/Student').default
    //   let student = {}
    //   if (this.isSet) {
    //     student = Student.findOne({ idNumber: this.value })
    //   }
    //   if (student) {
    //       return 'alreadyExist'
    //   }
    //   // return true
    // },
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
    regEx: /^[a-zA-Z\d\-\., ]{2,}$/,
    optional: true,
  },
  cityAddress: {
    type: String,
    // regEx: /^[a-zA-Z\d\-\., ]{2,}$/,
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
    // regEx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/,
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
    // regEx: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
  },
  mother: {
    type: Object,
    optional: true,
  },
  'mother.fullName': {
    type: String,
    // regEx: /^[a-zA-Z\d\-\., ]{2,}$/,
  },
  'mother.contactNumber': {
    type: String,
    // regEx: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
  },
  nameSuffix: {
    type: String,
    defaultValue: '',
    optional: true,
  },
  image: {
    // TODO: Image upload
    type: Object,
    defaultValue: {},
    blackbox: true,
  },
  courseIds: {
    type: [String],
    optional: true,
  },
})
