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
import GradeTransmutation from '/imports/both/models/GradeTransmutation'
import Notification from '/imports/both/models/Notification'

Meteor.startup(() => {
  Student.collection._ensureIndex({ lastName: 1 })
  User.collection._ensureIndex({ lastName: 1 })
  const semester = 'Second Semester'
  const schoolYear = '2016-2017'
  if (Department.find().count() === 0) {
    seeder.departmentsAndDegrees()
  }
  if (Student.find().count() < 5) {
    seeder.students(210)
  }
  if (!User.findOne({ roleName: 'dean' })) {
    seeder.users('dean', 'Software Engineering', 1)
  }
  if (!User.findOne({ roleName: 'secretary' })) {
    seeder.users('secretary', '', 1)
  }
  const depts = Department.find().fetch()
  if (!User.findOne({ roleName: 'department head' })) {
    depts.forEach(dept => seeder.users('department head', dept.name, 1))
  }
  if (User.find({ roleName: 'faculty' }).count() < 3) {
    depts.forEach(dept => seeder.users('faculty', dept.name, 1))
  }
  if (!AppSetting.findOne()) {
    seeder.appSetting(schoolYear, semester)
  }
  if (GradingTemplate.find().count() < 4) {
    seeder.gradingTemplates()
  }
  if (GradeTransmutation.find().count() === 0) {
    seeder.gradeTransmutations()
  }
  if (Role.find().count() < 4) {
    seeder.roles()
  }
  const subjects = [
    {
      name: 'Integral Calculus',
      courseNumber: 'EMath 321',
    },
    {
      name: 'Analytic Geometry',
      courseNumber: 'EMath 123',
    },
    {
      name: 'Engineering Economy',
      courseNumber: 'Engr 321',
    },
    {
      name: 'Software Development 2',
      courseNumber: 'SE4202',
      laboratoryType: 'SE Subject',
    },
    {
      name: 'Physics 2',
      courseNumber: 'EPhys 221',
      laboratoryType: 'Computational',
    },
    {
      name: 'Basic Electronics',
      courseNumber: 'EE 3201',
      laboratoryType: 'With Hands-on',
    },
  ]
  if (Subject.find().count() === 0) {
    subjects.forEach(subj => seeder.subject(subj))
  }
  if (Course.find().count() === 0) {
    const lecSubjects = Subject.find({ laboratoryType: { $exists: false } }).fetch()
    const labSubjects = Subject.find({ laboratoryType: { $exists: true } }).fetch()
    const faculties = User.find({ roleName: 'faculty' }).fetch()
    const studentsCount = Student.find().count()
    const studentLimit = studentsCount / faculties.length
    let currentStudentSkip = 0
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
      const courses = Course.find({ 'lecture.instructor._id': faculty._id }).fetch()
      const students = Student.find({}, { skip: currentStudentSkip, limit: studentLimit }).fetch()
      courses.forEach((course) => {
        students.forEach((student) => {
          course.studentIds.push(student._id)
          student.courseIds.push(course._id)
          course.save()
          student.save()
        })
      })
      currentStudentSkip += studentLimit
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
  }
  // if (Session.find().count() === 0) {
  //   const courses = Course.find().fetch()
  //   courses.forEach((course) => {
  //     seeder.session(course)
  //   })
  // }
  // const sessions = Session.find().fetch()
  // if (Activity.find().count() === 0) {
  //   sessions.forEach(session => seeder.activity(session, 'Quiz', 50, 'Quiz no. 1'))
  // }

  /* Patch for applying userId in Sessions and Activities */
  const courses = Course.find().fetch()
  // courses.forEach((course) => {
  //   // error on calling course.sessions due to determining the instructor type and the error exists on server only
  //   const sessionList = Session.find({ courseId: course._id }).fetch()
  //   sessionList.forEach((session) => {
  //     const activityList = session.activities
  //     const userId = (session.type === 'laboratory') ? course.laboratory.instructor._id : course.lecture.instructor._id
  //     if (!session.userId) {
  //       session.userId = userId
  //       session.save()
  //     }
  //     activityList.forEach((activity) => {
  //       if (!activity.userId) {
  //         activity.userId = userId
  //         activity.save()
  //       }
  //     })
  //   })
  // })
  /* Patch for applying gradingTemplateId in course */
  // courses.forEach((course) => {
  //   if (course.hasOwnProperty('gradingTemplate')) {
  //     const id = course.gradingTemplate._id
  //     delete course.gradingTemplate
  //     course.gradingTemplateId = id
  //     course.save()
  //   }
  // //  Course.update({ _id: course._id }, { $unset: { gradingTemplate: '' } })
  // })
})
