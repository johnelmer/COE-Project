import { Meteor } from 'meteor/meteor'
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

const name = faker.name
const random = faker.random

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
}

const fakeAddress = () => {
  return `${faker.address.streetName()}, ${faker.address.city()}`
}

const fakeContactNumber = () => {
  return `09${random.number(1000000000, 9999999999)}`
}

const fakeIdNumber = () => {
  return `${random.number({ min: 10, max: 17 })}-${random.number({ min: 1000, max: 9999 })}-${random.number({ min: 10, max: 99 })}`
}

const seeder = {
  departmentsAndDegrees: () => {
    data.deptsAndDegress.forEach((obj) => {
      const degreeId = new Degree({ name: obj.degree }).save()
      new Department({ name: obj.dept, degreeId: degreeId }).save()
    })
  },
  activityTypes: () => {
    data.activityTypes.forEach(type => new ActivityType({ name: type }).save())
  },
  students: (n) => {
    for (let i = 1; i <= n; i += 1) {
      new Student({
        firstName: name.firstName(),
        lastName: name.lastName(),
        middleName: name.lastName(),
        idNumber: fakeIdNumber(),
        gender: random.arrayElement(data.genders),
        degree: random.arrayElement(data.deptsAndDegress).degree,
        yearLevel: random.number({ min: 1, max: 5 }),
        birthday: faker.date.past(20),
        homeAddress: fakeAddress(),
        cityAddress: fakeAddress(),
        contactNumber: fakeContactNumber(),
        isGraduating: false,
        father: {
          fullName: name.findName(),
          contactNumber: fakeContactNumber(),
        },
        mother: {
          fullName: name.findName(),
          contactNumber: fakeContactNumber(),
        },
        courses: [],
      }).save()
    }
  },
  users: (role, department, n) => {
    for (let i = 1; i <= n; i += 1) {
      new User({
        username: faker.internet.userName(),
        password: data.defaultPassword,
        profile: {
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
        },
      }).save()
    }
  },
  appSetting: (schoolYear, semester) => {
    new AppSetting({ type: 'Main', currentSchoolYear: schoolYear, currentSemester: semester }).save()
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
  course: (subject, doc) => {
    doc.stubcode = random.number({ min: 1, max: 400 })
    const courseId = subject.getNewCourseId(doc)
    const lectInstructorId = doc.lecture.instructor._id
    User.update({ _id: lectInstructorId }, { $push: { courseIds: courseId } })
    if (doc.laboratory && doc.laboratory.instructorId !== lectInstructorId) {
      User.update({ _id: doc.laboratory.instructorId }, { $push: { courseIds: courseId } })
    }
    subject.save()
  },
  session: (course) => {
    course.getSessionByDate(new Date())
    course.save()
  },
  activity: (session, type, totalScore) => {
    const activity = session.getNewActivity(type, totalScore)
    activity.records.forEach(record => record.score = random.number({ min: 0, max: totalScore }))
    activity.save()
    session.save()
  },
}

export default seeder
