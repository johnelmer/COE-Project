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
// TODO: update schema
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
  // TODO: allowed values
  degree: {
    type: Object,
  },
  yearLevel: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  // TODO: regex
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
  /* TODO: specify fields
  sessions: {
    type: Array,
  },
  // TODO: specify fields
  students: {
    type: Array,
  },
  semester: {
    type: String,
  },*/
})

Schemas.role = new SimpleSchema({
  role: {
    type: String,
  },
  children: {
    type: [String],
  },
})

Schemas.session = new SimpleSchema({
  courseId: {
    type: String,
  },
  'attendance.$': {
    type: Object,
  },
  /* TODO: Pls complete the schema to avoid error
  'attendance.$.presents': {
    type: Array,
  },
  'attendance.$.lates': {
    type: Array,
  },
  'attendance.$.absents': {
    type: Array,
  },
  'attendance.$.excuses': {
    type: Array,
  },
  // TODO: specify fields
  activities: {
    type: Array,
  },*/
  date: {
    type: Date,
  },
})

export default Schemas