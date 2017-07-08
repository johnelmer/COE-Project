import { faker } from 'meteor/practicalmeteor:faker'
import Degree from '/imports/both/models/Degree'
import Department from '/imports/both/models/Department'
import Student from '/imports/both/models/Student'
import Course from '/imports/both/models/Course'
import Subject from '/imports/both/models/Subject'
import User from '/imports/both/models/User'
import Session from '/imports/both/models/Session'
import ActivityType from '/imports/both/models/ActivityType'
import Activity from '/imports/both/models/Activity'
import AppSetting from '/imports/both/models/AppSetting'
import Role from '/imports/both/models/Role'
import GradingTemplate from '/imports/both/models/GradingTemplate'
import GradeTransmutation from '/imports/both/models/GradeTransmutation'

const name = faker.name
const random = faker.random

const semesterActivityTypes = [
  {
    name: 'Quiz',
    percentage: 20,
    isMultiple: true,
  },
  {
    name: 'Class Participation',
    percentage: 10,
    isMultiple: true,
  },
  {
    name: 'Other Requirements',
    percentage: 10,
    isMultiple: true,
  },
  {
    name: 'Prelim Exam',
    percentage: 15,
    isMultiple: false,
  },
  {
    name: 'Midterm Exam',
    percentage: 20,
    isMultiple: false,
  },
  {
    name: 'Final Exam',
    percentage: 25,
    isMultiple: false,
  },
]

const data = {
  defaultPassword: 'cpucoe',
  genders: ['Male', 'Female'],
  deptsAndDegress: [
    { dept: 'Software Engineering', degree: 'BSSE' },
    { dept: 'Civil Engineering', degree: 'BSCE' },
    { dept: 'Chemical Engineering', degree: 'BSChE' },
    { dept: 'Electrical Engineering', degree: 'BSEE' },
    { dept: 'Electronics and Communications Engineering', degree: 'BSECE' },
    { dept: 'Mechanical Engineering', degree: 'BSME' },
    { dept: 'Packaging Engineering', degree: 'BSPkgE' },
  ],
  activityTypes: ['Quiz', 'Homework', 'Seatwork', 'Prelim Exam', 'Midterm Exam',
    'Final Exam', 'Midsummer Exam', 'Laboratory', 'Others'],
  civitStatuses: ['Single', 'Married', 'Divorced', 'Widowed'],
  roles: ['dean', 'secretary', 'department head', 'faculty'],
  rooms: ['En106', 'En107', 'En205', 'En304', 'En306'],
  timeScheds: ['8:00-9:00 MWF', '9:00-10:00MWF', '13:00-14:30 TTh', '8:30-10:00 TTh'],
  gradingTemplates: [
    {
      type: 'Semester Term',
      isDefault: true,
      lecture: {
        percentage: 100,
        activityTypes: semesterActivityTypes,
      },
      passingPercentage: 50,
      courseIds: [],
    },
    {
      type: 'Summer Term',
      isDefault: true,
      lecture: {
        percentage: 100,
        activityTypes: [
          {
            name: 'Quiz',
            percentage: 20,
            isMultiple: true,
          },
          {
            name: 'Class Participation',
            percentage: 10,
            isMultiple: true,
          },
          {
            name: 'Other Requirements',
            percentage: 10,
            isMultiple: true,
          },
          {
            name: 'Midsummer Exam',
            percentage: 25,
            isMultiple: true,
          },
          {
            name: 'Final Exam',
            percentage: 35,
            isMultiple: true,
          },
        ],
      },
      passingPercentage: 50,
      courseIds: [],
    },
    {
      type: 'Semester Term',
      isDefault: true,
      lecture: {
        percentage: 50,
        activityTypes: semesterActivityTypes,
      },
      laboratory: {
        percentage: 50,
        type: 'SE Subject',
        activityTypes: [
          {
            name: 'Hands-on',
            percentage: 20,
            isMultiple: true,
          },
          {
            name: 'Practical Exam',
            percentage: 40,
            isMultiple: true,
          },
          {
            name: 'Final Project',
            percentage: 40,
            isMultiple: false,
          },
        ],
      },
      passingPercentage: 50,
      courseIds: [],
    },
    {
      type: 'Semester Term',
      isDefault: true,
      lecture: {
        percentage: 80,
        activityTypes: semesterActivityTypes,
      },
      laboratory: {
        percentage: 20,
        type: 'Computational',
        activityTypes: [
          {
            name: 'Activity',
            percentage: 100,
            isMultiple: true,
          },
        ],
      },
      passingPercentage: 50,
      courseIds: [],
    },
    {
      type: 'Semester Term',
      isDefault: true,
      lecture: {
        percentage: 70,
        activityTypes: semesterActivityTypes,
      },
      laboratory: {
        percentage: 30,
        type: 'With Hands-on',
        activityTypes: [
          {
            name: 'Hands-on',
            percentage: 100,
            isMultiple: true,
          },
        ],
      },
      passingPercentage: 50,
      courseIds: [],
    },
  ],
  gradeTransmutations: [
    {
      name: 'Grade transmutation for 50% passing',
      passingPercentage: 50,
      gpaList: [
        { min: 0, max: 49.99, equivalent: '5.0' },
        { min: 50, max: 55.99, equivalent: '3.0' },
        { min: 56, max: 61.99, equivalent: '2.75' },
        { min: 62, max: 67.99, equivalent: '2.5' },
        { min: 68, max: 73.99, equivalent: '2.25' },
        { min: 74, max: 79.99, equivalent: '2.0' },
        { min: 80, max: 85.99, equivalent: '1.75' },
        { min: 86, max: 90.99, equivalent: '1.5' },
        { min: 91, max: 95.99, equivalent: '1.25' },
        { min: 96, max: 100, equivalent: '1.0' },
      ],
    },
    {
      name: 'Grade transmutation for 60% passing',
      passingPercentage: 60,
      gpaList: [
        { min: 0, max: 59.99, equivalent: '5.0' },
        { min: 60, max: 64.99, equivalent: '3.0' },
        { min: 65, max: 69.99, equivalent: '2.75' },
        { min: 70, max: 74.99, equivalent: '2.5' },
        { min: 75, max: 79.99, equivalent: '2.25' },
        { min: 80, max: 84.99, equivalent: '2.0' },
        { min: 85, max: 88.99, equivalent: '1.75' },
        { min: 89, max: 92.99, equivalent: '1.5' },
        { min: 93, max: 96.99, equivalent: '1.25' },
        { min: 97, max: 100, equivalent: '1.0' },
      ],
    },
  ],
}

const fakeAddress = () => {
  return `${faker.address.streetName()}, ${faker.address.city()}`
}

const fakeContactNumber = () => {
  return `09${random.number(100000000000, 1000000000000)}`.substring(0, 11)
}

const fakeIdNumber = () => {
  return `${random.number({ min: 10, max: 17 })}-${random.number({ min: 1000, max: 9999 })}-${random.number({ min: 10, max: 99 })}`
}

const randomData = (arr) => {
  return arr[random.number({ min: 0, max: arr.length - 1 })]
}

const seeder = {
  departmentsAndDegrees: () => {
    data.deptsAndDegress.forEach((obj) => {
      const degreeId = new Degree({ name: obj.degree }).save()
      new Department({ name: obj.dept, degreeId: degreeId }).save()
    })
  },
  // students: (n) => {
  //   for (let i = 1; i <= n; i += 1) {
  //     new Student({
  //       firstName: name.firstName(),
  //       lastName: name.lastName(),
  //       middleName: name.lastName(),
  //       idNumber: fakeIdNumber(),
  //       gender: random.arrayElement(data.genders),
  //       degree: random.arrayElement(data.deptsAndDegress).degree,
  //       yearLevel: random.number({ min: 1, max: 5 }),
  //       birthday: faker.date.past(20),
  //       homeAddress: fakeAddress(),
  //       cityAddress: fakeAddress(),
  //       contactNumber: fakeContactNumber(),
  //       isGraduating: false,
  //       father: {
  //         fullName: name.findName(),
  //         contactNumber: fakeContactNumber(),
  //       },
  //       mother: {
  //         fullName: name.findName(),
  //         contactNumber: fakeContactNumber(),
  //       },
  //       courseIds: [],
  //     }).save()
  //   }
  // },
  users: (role, department, n) => {
    for (let i = 1; i <= n; i += 1) {
      new User({
        username: faker.internet.userName(),
        password: data.defaultPassword,
        firstName: name.firstName(),
        lastName: name.lastName(),
        middleName: name.lastName(),
        idNumber: fakeIdNumber(),
        contactNumber: fakeContactNumber(),
        civilStatus: random.arrayElement(data.civitStatuses),
        address: fakeAddress(),
        departments: [department],
        status: 'Active',
        birthday: faker.date.past(35),
        gender: random.arrayElement(data.genders),
        roleName: role,
        subjectAssignedIds: [],
        courseIds: [],
        notificationIds: [],
      }).save()
    }
  },
  appSetting: (schoolYear, semester) => {
    new AppSetting({ type: 'Main', currentSchoolYear: schoolYear, currentSemester: semester }).save()
  },
  gradingTemplates: () => {
    data.gradingTemplates.forEach(gradtemplate => new GradingTemplate(gradtemplate).save())
  },
  gradeTransmutations: () => {
    data.gradeTransmutations.forEach((gradeTransmutation) => {
      new GradeTransmutation(gradeTransmutation).save()
    })
  },
  roles: () => {
    const secretaryId = new Role({ name: 'secretary', childIds: [] }).save()
    const facultyId = new Role({ name: 'faculty', childIds: [] }).save()
    const deptHeadId = new Role({ name: 'department head', childIds: [facultyId] }).save()
    new Role({ name: 'dean', childIds: [secretaryId, deptHeadId] }).save()
  },
  subject: (doc) => {
    const subject = new Subject({
      name: doc.name,
      courseNumber: doc.courseNumber,
      credits: 3,
      units: 3,
      courseIds: [],
    })
    if (doc.laboratoryType) {
      subject.laboratoryType = doc.laboratoryType
    }
    subject.save()
  },
  courses: (subject, doc, n) => {
    for (let i = 1; i <= n; i += 1) {
      ['lecture', 'laboratory'].forEach((type) => {
        const field = doc[type]
        if (field) {
          field.time = randomData(data.timeScheds)
          field.room = randomData(data.rooms)
          field.sessions = []
        }
      })
      doc.stubcode = random.number({ min: 1, max: 500 })
      const courseId = subject.getNewCourseId(doc)
      const lectInstructorId = doc.lecture.instructor._id
      User.update({ _id: lectInstructorId }, { $push: { courseIds: courseId } })
      if (doc.laboratory && doc.laboratory.instructorId !== lectInstructorId) {
        User.update({ _id: doc.laboratory.instructorId }, { $push: { courseIds: courseId } })
      }
      subject.save()
    }
  },
  session: (course) => {
    course.getSessionByDate(new Date(), 'lecture')
    course.save()
  },
  activity: (session, type, totalScore, description) => {
    const activity = session.getNewActivity(type, totalScore, description)
    activity.records.forEach(record => record.score = random.number({ min: 0, max: totalScore }))
    activity.save()
    session.save()
  },
}

export default seeder
