import { Meteor } from 'meteor/meteor'
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

Meteor.startup(() => {
  Student.collection._ensureIndex({ lastName: 1 })
  User.collection._ensureIndex({ lastName: 1 })
  const semester = 'Second Semester'
  const schoolYear = '2016-2017'
  if (Department.find().count() === 0) {
    seeder.departmentsAndDegrees()
  }
  if (ActivityType.find().count() === 0) {
    seeder.activityTypes()
  }
  if (Student.find().count() < 5) {
    seeder.students(5)
  }
  if (!User.findOne({ roleName: 'dean' })) {
    seeder.users('dean', 'Mechanical Engineering', 1)
  }
  if (!User.findOne({ roleName: 'secretary' })) {
    seeder.users('secretary', '', 1)
  }
  if (!User.findOne({ roleName: 'department head' })) {
    seeder.users('department head', 'Civil Engineering', 1)
    seeder.users('department head', 'Software Engineering', 1)
    seeder.users('department head', 'Chemical Engineering', 1)
  }
  if (User.find({ roleName: 'faculty' }).count() < 3) {
    seeder.users('faculty', 'Software Engineering', 2)
    seeder.users('faculty', 'Civil Engineering', 2)
  }
  if (!AppSetting.findOne()) {
    seeder.appSetting(schoolYear, semester)
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
  const subjects = Subject.find().fetch()
  const students = Student.find().fetch()
  const faculties = User.find({ roleName: 'faculty' }).fetch()
  let courses = []
  if (Course.find().count() === 0) {
    seeder.course(subjects[0], {
      lecture: {
        time: '7:00-8:30 TTh',
        room: 'En305',
        instructor: {
          _id: faculties[0]._id,
          fullName: faculties[0].fullName,
          idNumber: faculties[0].idNumber,
        },
      },
    })
    seeder.course(subjects[1], {
      lecture: {
        time: '10:00-11:30 TTh',
        room: 'En205',
        instructor: {
          _id: faculties[1]._id,
          fullName: faculties[1].fullName,
          idNumber: faculties[1].idNumber,
        },
      },
      laboratory: {
        time: '11:30-1:00 TTh',
        room: 'En204',
        instructor: {
          _id: faculties[1]._id,
          fullName: faculties[1].fullName,
          idNumber: faculties[1].idNumber,
        },
      },
    })
    seeder.course(subjects[2], {
      lecture: {
        time: '9:00-10:00 WMF',
        room: 'En305',
        instructor: {
          _id: faculties[2]._id,
          fullName: faculties[2].fullName,
          idNumber: faculties[2].idNumber,
        },
      },
      laboratory: {
        time: '1:30-2:30 TTh',
        room: 'En204',
        instructor: {
          _id: faculties[2]._id,
          fullName: faculties[2].fullName,
          idNumber: faculties[2].idNumber,
        },
      },
    })
    seeder.course(subjects[3], {
      lecture: {
        time: '7:00-8:30 TTh',
        room: 'En305',
        instructor: {
          _id: faculties[3]._id,
          fullName: faculties[3].fullName,
          idNumber: faculties[3].idNumber,
        },
      },
      laboratory: {
        time: '7:00-8:00 MWF',
        room: 'En204',
        instructor: {
          _id: faculties[3]._id,
          fullName: faculties[3].fullName,
          idNumber: faculties[3].idNumber,
        },
      },
      semester: 'Second Semester',
      schoolYear: '2016-2017',
    })
    courses = Course.find().fetch()
    for (let i = 0; i <= 3; i += 1) {
      faculties[i].courseIds.push(courses[i]._id)
      faculties[i].save()
    }
    students.forEach((student) => {
      courses[0].enrollAStudent(student)
      courses[0].save()
    })
    students.forEach((student) => {
      courses[1].enrollAStudent(student)
      courses[1].save()
    })
  }
  if (Session.find().count() === 0) {
    courses = Course.find().fetch()
    seeder.session(courses[0])
    seeder.session(courses[1])
  }
  const sessions = Session.find().fetch()
  if (Activity.find().count() === 0) {
    seeder.activity(sessions[0], 'Quiz', 50)
    seeder.activity(sessions[1], 'Seatwork', 20)
  }
})
