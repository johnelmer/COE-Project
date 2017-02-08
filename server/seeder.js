import _ from 'underscore'

import Degree from '/imports/both/models/Degree'
import Student from '/imports/both/models/Student'
import Course from '/imports/both/models/Course'
import Subject from '/imports/both/models/Subject'
import User from '/imports/both/models/User'
import Session from '/imports/both/models/Session'
<<<<<<< HEAD
import ActivityType from '/imports/both/models/ActivityType'
=======
import Role from '/imports/both/models/Role'

import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

import loadAccounts from './startup'
>>>>>>> f2d0353a2db93a18418a5c01e3bd845591dd35be

const data = {
  students: [
    {
      firstName: 'Sian Paul',
      lastName: 'Lasaga',
      middleName: 'Bela-Ong',
      idNumber: '13-1224-79',
      gender: 'Male',
      degree: 'BSSE',
      yearLevel: 4,
      birthday: new Date('04/19/96'),
      contactNumber: '09277838893',
      address: 'Pavia',
      isGraduating: false,
      guardian: {
        fullName: 'Mrs. Lasaga',
        contactNumber: '09292929292',
      },
      courses: [],
    },
    {
      firstName: 'James',
      lastName: 'Barte',
      middleName: 'B',
      idNumber: '13-6969-69',
      gender: 'Male',
      degree: 'BSSE',
      yearLevel: 4,
      birthday: new Date('06/09/96'),
      contactNumber: '09060606066',
      address: 'Jaro',
      isGraduating: false,
      guardian: {
        fullName: 'Mrs. Barte',
        contactNumber: '09060666123',
      },
      courses: [],
    },
    {
      firstName: 'Daryl Faith',
      lastName: 'Matutina',
      middleName: 'S',
      idNumber: '13-0114-02',
      gender: 'Male',
      degree: 'BSSE',
      yearLevel: 4,
      birthday: new Date('11/11/96'),
      contactNumber: '09280538501',
      address: 'Aklan',
      isGraduating: false,
      guardian: {
        fullName: 'Mrs. Matutina',
        contactNumber: '09282529152',
      },
      courses: [],
    },
    {
      firstName: 'John Elmer',
      lastName: 'Loretizo',
      middleName: 'L',
      idNumber: '13-0014-22',
      gender: 'Male',
      degree: 'BSSE',
      yearLevel: 4,
      birthday: new Date('09/10/96'),
      contactNumber: '09060238402',
      address: 'Gensan',
      isGraduating: false,
      guardian: {
        fullName: 'Mrs. Loretizo',
        contactNumber: '09061125252',
      },
      courses: [],
    },
    {
      firstName: 'Vince Paul',
      lastName: 'dela Cruz',
      middleName: 'M',
      idNumber: '13-0214-33',
      gender: 'Male',
      degree: 'BSSE',
      yearLevel: 4,
      birthday: new Date('07/22/96'),
      contactNumber: '09988532501',
      address: 'Capiz',
      isGraduating: false,
      guardian: {
        fullName: 'Mrs. dela Cruz',
        contactNumber: '09182329145',
      },
      courses: [],
    },
  ],
  teachers: [
    {
      username: 'sircoo',
      password: 'sircoo',
      profile: {
        firstName: 'Richard Michael',
        lastName: 'Coo',
        middleName: 'C',
        idNumber: '05-1234-22',
        contactNumber: '09161628911',
        address: 'Pavia',
        department: 'SE',
        roleName: 'dept. head',
      },
    },
    {
      username: 'sirjune',
      password: 'sirjune',
      profile: {
        firstName: 'June Dick',
        lastName: 'Espinosa',
        middleName: 'E',
        idNumber: '04-1134-12',
        contactNumber: '09262527921',
        address: 'Jaro',
        department: 'SE',
        roleName: 'faculty',
      },
    },
  ],
  subjects: [
    {
      name: 'SE Subject',
      courseNumber: 'SE4102',
      credits: 3.0,
      units: 3.0,
      isOffered: true,
      teacherAssignedIds: [],
    },
    {
      name: 'SE Subject',
      courseNumber: 'SE4201',
      credits: 3.0,
      units: 3.0,
      isOffered: false,
      teacherAssignedIds: [],
    },
    {
      name: 'Math',
      courseNumber: 'EMath2001',
      credits: 3.0,
      units: 3.0,
      isOffered: true,
      teacherAssignedIds: [],
    },
    {
      name: 'Mech',
      courseNumber: 'Mech301',
      credits: 3.0,
      units: 3.0,
      isOffered: true,
      teacherAssignedIds: [],
    },
  ],
  degrees: [
    { name: 'BSSE' }, { name: 'BSCE' }, { name: 'BSEE' }, { name: 'BSECE' },
    { name: 'BSChE' }, { name: 'BSME' }, { name: 'BSPkgE' },
  ],
  activityTypes: [
    { name: 'Quiz' }, { name: 'Homework' }, { name: 'Seatwork' }, { name: 'Prelim Exam' }, { name: 'Midterm Exam' }, { name: 'Final Exam' },
  ],
}

Meteor.startup(() => {
  if (Role.find().count() === 0) {
    const deanRole = new Role({ name: 'dean' })
    const secretaryRole = new Role({ name: 'secretary' })
    const technicianRole = new Role({ name: 'technician' })
    const teacherRole = new Role({ name: 'teacher' })
    const studentRole = new Role({ name: 'student' })

    deanRole.save()
    secretaryRole.save()
    technicianRole.save()
    teacherRole.save()
    studentRole.save()

    const dean = Role.findOne({ name: 'dean' })
    const secretary = Role.findOne({ name: 'secretary' })
    const technician = Role.findOne({ name: 'technician' })
    const teacher = Role.findOne({ name: 'teacher' })
    const student = Role.findOne({ name: 'student' })
    dean.childIds.push(secretary._id)

    // i don't know the real hierarchy just yet. lol
    secretary.childIds.push(...[technician._id, teacher._id])
    teacher.childIds.push(student._id)

    dean.save()
    secretary.save()
    teacher.save()
    student.save()

  }
  if (Degree.find().count() === 0) {
    data.degrees.forEach((degree) => {
      const newDegree = new Degree(degree)
      newDegree.save()
    })
  }
  if (ActivityType.find().count() === 0) {
    data.activityTypes.forEach((type) => {
      const activityType = new ActivityType({
        name: type.name,
      })
      activityType.save()
    })
  }
  if (Student.find().count() === 0) {
    data.students.forEach((student) => {
      const newStudent = new Student(student)
      newStudent.save()
    })
  }
  if (User.find().count() === 0) {
    loadAccounts()
    data.teachers.forEach((teacher) => {
      const newTeacher = new User(teacher)
      newTeacher.save()
    })
  }
  if (Subject.find().count() === 0) {
    data.subjects.forEach((subject) => {
      const newSubject = new Subject(subject)
      newSubject.save()
    })
  }
  if (Course.find().count() === 0) {
    const subject = Subject.find().fetch()[1]
    const students = Student.find().fetch()
    const teachers = User.find().fetch()
    const newCourse = new Course({
      stubcode: '123',
      subject: {
        _id: subject._id,
        name: subject.name,
        courseNumber: subject.courseNumber,
        credits: subject.credits,
        units: subject.units,
      },
      lecture: {
        time: '7:00-8:30 TTh',
        room: 'En205',
        instructorId: teachers[1]._id,
      },
      laboratory: {},
      students: [],
      sessionIds: [],
      semester: '2016-2017',
    })
    newCourse.save()
    const addedCourse = Course.find().fetch()[0]
    students.forEach((student) => {
      addedCourse.enrollAStudent(student)
      addedCourse.save()
    })
  }
  if (Session.find().count() === 0) {
    const students = Student.find().fetch()
    const course = Course.find().fetch()[0]
    const session = new Session({
      courseId: course._id,
      attendance: {},
      activities: [],
      date: new Date('02/07/2017'),
    })
    session.save()
    const addedSession = Session.find().fetch()[0]
    course.addSession(addedSession._id)
    course.save()
    addedSession.activities.push({
      type: 'Seatwork',
      totalScore: 10,
      records: [
        {
          studentId: students[0]._id,
          studentFirstName: students[0].firstName,
          studentLastName: students[0].lastName,
          score: 5,
        },
        {
          studentId: students[3]._id,
          studentFirstName: students[0].firstName,
          studentLastName: students[0].lastName,
          score: 7,
        },
      ],
    })
    session.save()
  }
})
