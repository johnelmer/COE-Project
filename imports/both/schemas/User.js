import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  username: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  idNumber: {
    type: String,
    regEx: /^\d{2}\-\d{4}\-\d{2}$/,
  },
  contactNumber: {
    type: String,
    regEx: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
  },
  civilStatus: {
    type: String,
  },
  address: {
    type: String,
  },
  departments: {
    type: [String],
    optional: true,
  },
  status: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  courseIds: {
    type: [String],
    optional: true,
  },
  gender: {
    type: String,
  },
  roleName: {
    type: String,
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
  createdAt: {
    type: Date,
    optional: true,
  },
  profile: {
    type: Object,
    optional: true,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  image: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  email: {
    type: String,
    optional: true,
    regEx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/,
  },
  notifications: {
    type: [Object],
    optional: true,
  },
  'notifications.$._id': {
    type: String,
  },
  'notifications.$.isSeen':{
    type: Boolean,
  },
})
