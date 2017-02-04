import { SimpleSchema } from 'meteor/aldeed:simple-schema'
// import Degree from './models/Degree'

const Schemas = {}
// const degrees = Degree.find().fetch().map(degree => degree.name)

Schemas.embeddedProfile = new SimpleSchema({
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
  address: {
    type: String,
  },
  department: {
    type: String,
  },
  courses: {
    type: [Object],
    optional: true,
  },
})

Schemas.user = new SimpleSchema({
  username: {
    type: String,
  },
  role: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
  },
  profile: {
    type: Schemas.embeddedProfile,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
})

Schemas.degree = new SimpleSchema({
  name: {
    type: String,
    min: 4,
  },
})

Schemas.embeddedTeacher = new SimpleSchema({
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
    type: Schemas.embeddedTeacher,
  },
})

Schemas.embeddedGuardian = new SimpleSchema({
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
  middleName: {
    type: String,
  },
  idNumber: {
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
  address: {
    type: String,
  },
  isGraduating: {
    type: Boolean,
  },
  guardian: {
    type: Schemas.embeddedGuardian,
  },
/* //TODO
  createdAt: {
    type: Date,
    autoValue: () => {
      if (!this.isInsert) {
        this.unset()
      }
      return new Date()
    },
  },*/
})

Schemas.embeddedSubject = new SimpleSchema({
  _id: {
    type: String,
  },
  name: {
    type: String,
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
})

Schemas.embeddedCourseType = new SimpleSchema({
  time: {
    type: String,
  },
  room: {
    type: String,
  },
  instructor: {
    type: Schemas.embeddedTeacher,
  },
})

Schemas.embeddedStudent = new SimpleSchema({
  _id: {
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
  degree: {
    type: String,
    // allowedValues: degrees,
  },
  yearLevel: {
    type: Number,
  },
})

Schemas.course = new SimpleSchema({
  subject: {
    type: Schemas.embeddedSubject,
  },
  stubcode: {
    type: String,
  },
  lecture: {
    type: Schemas.embeddedCourseType,
  },
  laboratory: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  sessions: {
    type: Array,
    optional: true,
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
    optional: true,
  },
  'students.$': {
    type: Schemas.embeddedStudent,
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

Schemas.embeddedAttendance = new SimpleSchema({
  presents: {
    type: [String],
    optional: true,
  },
  lates: {
    type: [String],
    optional: true,
  },
  absents: {
    type: [String],
    optional: true,
  },
  excuses: {
    type: [String],
    optional: true,
  },
})

Schemas.embeddedRecord = new SimpleSchema({
  studentId: {
    type: String,
  },
  score: {
    type: Number,
  },
})

Schemas.embeddedActivity = new SimpleSchema({
  /* TODO: allowed values */
  type: {
    type: String,
  },
  totalScore: {
    type: Number,
  },
  records: {
    type: Array,
  },
  'records.$': {
    type: Schemas.embeddedRecord,
  },
})

Schemas.session = new SimpleSchema({
  courseId: {
    type: String,
  },
  attendance: {
    type: Schemas.embeddedAttendance,
    optional: true,
  },
  activities: {
    type: Array,
  },
  'activities.$': {
    type: Schemas.embeddedActivity,
    optional: true,
  },
  date: {
    type: Date,
  },
})

export default Schemas
