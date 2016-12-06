import { SimpleSchema } from 'meteor/aldeed:simple-schema'

const Schemas = {}

Schemas.Course = new SimpleSchema({
  name: {
    type: String,
    min: 4,
  },
})

export default Schemas
