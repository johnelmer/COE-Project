import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  name: {
    type: String,
    min: 4,
  },
})
