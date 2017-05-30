import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  userIds: {
    type: String,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
})
