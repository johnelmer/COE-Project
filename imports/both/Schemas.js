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

Schemas.student = new SimpleSchema({
  name: {
    type: String,
    min: 2,
  },
  studentId: {
    type: String,
  },
  gender: {
    type: String,
  },
  degree: {
    type: Object,
  },
  yearLevel: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  contactNumber: {
    type: String,
  },
  isGraduating: {
    type: Boolean,
  },
})

Schemas.course = new SimpleSchema({
  subject: {
    type: Object,
  },
  stubCode: {
    type: String,
  },
  'lecture.$': {
    type: Object,
  },
  'lecture.$.time': {
    type: Date,
  },
  'lecture.$.room': {
    type: String,
  },
  'lecture.$.instructor': {
    type: Object,
  },
  'laboratory.$': {
    type: Object,
  },
  'laboratory.$.time': {
    type: Date,
  },
  'laboratory.$.room': {
    type: String,
  },
  'laboratory.$.instructor': {
    type: String,
  },
  sessions: {
    type: Array,
  },
  students: {
    type: Array,
  },
  semester: {
    type: String,
  },
})

Schemas.role = new SimpleSchema({
  role: {
    type: String,
  },
  children: {
    type: [String],
  },
})

export default Schemas
