import { Meteor } from 'meteor/meteor'
import _ from 'underscore'
import { faker } from 'meteor/practicalmeteor:faker'
import seeder from './seeder.js'
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

Meteor.startup(() => {
  Student.collection._ensureIndex({ lastName: 1 })
  User.collection._ensureIndex({ lastName: 1 })
  const semester = 'Second Semester'
  const schoolYear = '2016-2017'
  if (Department.find().count() === 0) {
    seeder.departmentsAndDegrees()
  }
  if (Student.find().count() < 5) {
    seeder.students(80)
  }
  if (!User.findOne({ roleName: 'dean' })) {
    seeder.users('dean', 'Mechanical Engineering', 1)
  }
  if (!User.findOne({ roleName: 'secretary' })) {
    seeder.users('secretary', '', 1)
  }
  const depts = Department.find().fetch()
  if (!User.findOne({ roleName: 'department head' })) {
    depts.forEach(dept => seeder.users('department head', dept.name, 1))
  }
  if (User.find({ roleName: 'faculty' }).count() < 3) {
    depts.forEach(dept => seeder.users('faculty', dept.name, 2))
  }
  if (!AppSetting.findOne()) {
    seeder.appSetting(schoolYear, semester)
  }
  if (GradingTemplate.find().fetch() < 4) {
    seeder.gradingTemplates()
  }
  if (Role.find().count() < 4) {
    seeder.roles()
  }
  if (Subject.find().count() === 0) {
    seeder.subject({
      name: 'Integral Calculus',
      courseNumber: 'EMath 321',
    })
    seeder.subject({
      name: 'Analytic Geometry',
      courseNumber: 'EMath 123',
    })
    seeder.subject({
      name: 'Engineering Economy',
      courseNumber: 'Engr 321',
    })
    seeder.subject({
      name: 'Software Development 2',
      courseNumber: 'SE4202',
      laboratoryType: 'SE Subject',
    })
    seeder.subject({
      name: 'Physics 2',
      courseNumber: 'EPhys 221',
      laboratoryType: 'Computational',
    })
    seeder.subject({
      name: 'Basic Electronics',
      courseNumber: 'EE 3201',
      laboratoryType: 'With Hands-on',
    })
  }
  const lecSubjects = Subject.find({ laboratoryType: { $exists: false } }).fetch()
  const labSubjects = Subject.find({ laboratoryType: { $exists: true } }).fetch()
  const students = Student.find({}, { limit: 35 }).fetch()
  const faculties = User.find({ roleName: 'faculty' }).fetch()
  let courses = []
  if (Course.find().count() === 0) {
    faculties.forEach((faculty) => {
      const instructor = _.pick(faculty, '_id', 'fullName', 'idNumber')
      lecSubjects.forEach((subject) => {
        seeder.courses(subject, {
          lecture: {
            instructor: instructor,
          },
        }, 1)
      })
      labSubjects.forEach((subject) => {
        seeder.courses(subject, {
          lecture: {
            instructor: instructor,
          },
          laboratory: {
            instructor: instructor,
          },
        }, 1)
      })
    })
    seeder.courses(labSubjects[0], {
      lecture: {
        instructor: _.pick(faculties[0], '_id', 'fullName', 'idNumber'),
      },
      laboratory: {
        instructor: _.pick(faculties[1], '_id', 'fullName', 'idNumber'),
      },
    })
    seeder.courses(labSubjects[1], {
      lecture: {
        instructor: _.pick(faculties[0], '_id', 'fullName', 'idNumber'),
      },
      laboratory: {
        instructor: _.pick(faculties[1], '_id', 'fullName', 'idNumber'),
      },
    })
    seeder.courses(labSubjects[2], {
      lecture: {
        instructor: _.pick(faculties[2], '_id', 'fullName', 'idNumber'),
      },
      laboratory: {
        instructor: _.pick(faculties[3], '_id', 'fullName', 'idNumber'),
      },
    })
    courses = Course.find().fetch()
    courses.forEach((course) => {
      students.forEach((student) => {
        course.enrollAStudent(student)
        student.courseIds.push(course._id)
        course.save()
        student.save()
      })
    })
  }
  if (Session.find().count() === 0) {
    courses.forEach((course) => {
      seeder.session(course)
    })
  }
  const sessions = Session.find().fetch()
  if (Activity.find().count() === 0) {
    sessions.forEach(session => seeder.activity(session, 'Quiz', 50, 'Quiz no. 1'))
  }
})
