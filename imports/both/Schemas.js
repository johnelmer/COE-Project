import { SimpleSchema } from 'meteor/aldeed:simple-schema'
// import Degree from './models/Degree'

const Schemas = {}
// const degrees = Degree.find().fetch().map(degree => degree.name)

Schemas.user = new SimpleSchema({
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
  status: {
    type: String,
  },
  birthday: {
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
  courseIds: {
    type: [String],
    optional: true,
  },
  roleName: {
    type: String,
    optional: true,
  },
<<<<<<< HEAD
  guardian: {
    type: String,
=======
  createdAt: {
    type: Date,
  },
  profile: {
    type: Object,
    optional: true,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
>>>>>>> 8bbbac90747cbc3dccded7cb8d420f1e3c90e79d
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
  courseIds: {
    type: [String],
    optional: true,
  },
  teachersAssignedIds: {
    type: [String],
    optional: true,
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

Schemas.embeddedCourse = new SimpleSchema({
  subject: {
    type: Schemas.embeddedSubject,
  },
  lecture: {
    type: Schemas.embeddedCourseType,
  },
  laboratory: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  semester: {
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
    optional: true,
  },
  guardian: {
    type: Schemas.embeddedGuardian,
  },
<<<<<<< HEAD
  address: {
    type: String,
  },
=======
  courses: {
    type: [Schemas.embeddedCourse],
    optional: true,
  },

>>>>>>> 8bbbac90747cbc3dccded7cb8d420f1e3c90e79d
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
  instructorId: {
    type: String,
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

Schemas.activitytype = new SimpleSchema({
  name: {
    type: String,
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
  sessionIds: {
    type: [String],
    optional: true,
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
  name: {
    type: String,
  },
  childIds: {
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
  studentFirstName: {
    type: String,
  },
  studentLastName: {
    type: String,
  },
  score: {
    type: Number,
  },
})

Schemas.activity = new SimpleSchema({
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
  activityIds: {
    type: [String],
    optional: true,
  },
  date: {
    type: Date,
  },
})

export default Schemas
