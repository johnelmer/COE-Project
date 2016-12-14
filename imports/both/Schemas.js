import { SimpleSchema } from 'meteor/aldeed:simple-schema'

const Schemas = {}

Schemas.degree = new SimpleSchema({
  name: {
    type: String,
    min: 4,
  },
})

Schemas.subject = new SimpleSchema({
  name: {
    type: String,
    min: 2,
  },
  courseNumber: {
    type: String,
  },
  credits: {
    type: Number,
  },
  units: {
    type: Number,
  },
  isOffered: {
    type: Boolean,
  },
  courses: {
    type: Array,
    optional: true,
  },
  'courses.$': {
    type: Object,
    optional: true,
  },
  teachersAssigned: {
    type: Array,
    optional: true,
  },
  'teachersAssigned.$': {
    type: Object,
  },
  'teachersAssigned.$._id': {
    type: String,
  },
  'teachersAssigned.$.firstName': {
    type: String,
  },
  'teachersAssigned.$.lastName': {
    type: String,
  },
})

Schemas.Course = {}

export default Schemas
