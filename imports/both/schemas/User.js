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
  },
  contactNumber: {
    type: String,
  },
  civilStatus: {
    type: String,
  },
  address: {
    type: String,
  },
  department: {
    optional: true,
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
  },
  roleName: {
    type: String,
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
    // TODO: regex
    type: String,
    optional: true,
  }
})
