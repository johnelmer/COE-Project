import { SimpleSchema } from 'meteor/aldeed:simple-schema'

SimpleSchema.messages({
  'alreadyExist': '[label] already exist',
})

export default new SimpleSchema({
  createdAt: {
    type: Date,
  },
  title: {
    type: String,
    custom: function () {
      const Meeting = require('/imports/both/models/Meeting').default
      let meeting = {}
      if (this.isSet) {
        meeting = Meeting.findOne({ title: this.value })
      }
      if (meeting) {
          // return 'notAllowed'
          return 'alreadyExist'
      }
      // return true
    }
  },
  attendeeIds: {
    type: [String],
    optional: true,
    custom: function () {
      console.log(this);
    },
  },
  schedule: {
    type: Date,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  filename: {
    type: String,
    optional: true,
  },
})
