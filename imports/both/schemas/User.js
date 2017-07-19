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
  department: {
    type: String,
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
    allowedValues: ['Male', 'Female'],
  },
  roleName: {
    type: String,
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
  // rankName: {
  //   type: String,
  //   optional: true,
  // },
  image: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  'image.code': {
    type: String,
  },
  'image.dateUploaded': {
    type: Date,
  },
  'image.lastModified': { // returns the most recent modification of the image
    type: Date,
  },
  // email: {
  //   type: String,
  //   optional: true,
  //   regEx: SimpleSchema.RegEx.Email,
  // },
  notificationIds: {
    type: [String],
    optional: true,
  },
})
