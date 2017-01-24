import { SimpleSchema } from 'meteor/aldeed:simple-schema'
// import Degree from './models/Degree'

const Schemas = {}
// const degrees = Degree.find().fetch().map(degree => degree.name)

Schemas.degree = new SimpleSchema({
  name: {
    type: String,
    min: 4,
  },
})

Schemas.embededTeacher = new SimpleSchema({
  _id: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
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
  'courses.$.stubcode': {
    type: String,
  },
  'courses.$.lecture': {
    type: Object,
  },
  'courses.$.laboratory': {
    type: Object,
    optional: true,
  },
  'courses.$.schoolYear': {
    type: String,
  },
  teachersAssigned: {
    type: Array,
    optional: true,
  },
  'teachersAssigned.$': {
    type: Schemas.embededTeacher,
  },
})

Schemas.embededGuardian = new SimpleSchema({
  fullName: {
    type: String,
    min: 2,
  },
// TODO: RegEx
  contactNumber: {
    type: String,
  },
})

Schemas.student = new SimpleSchema({
// TODO: update schema
  firstName: {
    type: String,
    min: 2,
  },
  lastName: {
    type: String,
    min: 2,
  },
  middelName: {
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
    type: String,
    // allowedValues: degrees,
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
  guardian: {
    type: Schemas.embededGuardian,
  },
  createdAt: {
    type: Date,
    autoValue: () => {
      if (!this.isInsert) {
        this.unset()
      }
      return new Date()
    },
  },
})

Schemas.embededCourseType = new SimpleSchema({
  time: {
    type: String,
  },
  room: {
    type: String,
  },
  instructor: {
    type: Schemas.embededTeacher,
  },
})

Schemas.embededStudent = new SimpleSchema({
  _id: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  middelName: {
    type: String,
  },
  degree: {
    type: String,
    // allowedValues: degrees,
  },
  yearLevel: {
    type: Number,
  },
})

<<<<<<< HEAD
=======
Schemas.course = new SimpleSchema({
  subject: {
    type: Object,
  },
  stubCode: {
    type: String,
  },
  'lecture.$': {
    type: Schemas.embededCourseType,
  },
  'laboratory.$': {
    type: Schemas.embededCourseType,
  },
  sessions: {
    type: Array,
  },
  'sessions.$': {
    type: Object,
    optional: true,
  },
  'sessions.$._id': {
    type: String,
  },
  'sessions.$.date': {
    type: Date,
  },
  // TODO: specify fields
  students: {
    type: Array,
  },
  'students.$': {
    type: Schemas.embededStudent,
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
>>>>>>> 35b4ae6c0655569b374c797758038700f0d3f7ae

export default Schemas
