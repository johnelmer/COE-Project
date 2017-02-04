import { Meteor } from 'meteor/meteor'

import loadAccounts from './startup'
import Degree from '/imports/both/models/Degree'
import Student from '/imports/both/models/Student'
import Course from '/imports/both/models/Course'
import Subject from '/imports/both/models/Subject'
import User from '/imports/both/models/User'
import Session from '/imports/both/models/Session'

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
    },
  ],
  teachers: [
    {
      username: 'sircoo',
      password: 'sircoo',
      role: 'Dept. Head',
      profile: {
        firstName: 'Richard Michael',
        lastName: 'Coo',
        middleName: 'C',
        idNumber: '05-1234-22',
        contactNumber: '09161628911',
        address: 'Pavia',
        department: 'SE',
      },
    },
    {
      username: 'sirjune',
      password: 'sirjune',
      role: 'Faculty',
      profile: {
        firstName: 'June Dick',
        lastName: 'Espinosa',
        middleName: 'E',
        idNumber: '04-1134-12',
        contactNumber: '09262527921',
        address: 'Jaro',
        department: 'SE',
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
    },
    {
      name: 'SE Subject',
      courseNumber: 'SE4201',
      credits: 3.0,
      units: 3.0,
      isOffered: false,
    },
    {
      name: 'Math',
      courseNumber: 'EMath2001',
      credits: 3.0,
      units: 3.0,
      isOffered: true,
    },
    {
      name: 'Mech',
      courseNumber: 'Mech301',
      credits: 3.0,
      units: 3.0,
      isOffered: true,
    },
  ],
  degrees: [
    { name: 'BSSE' }, { name: 'BSCE' }, { name: 'BSEE' }, { name: 'BSECE' },
    { name: 'BSChE' }, { name: 'BSME' }, { name: 'BSPkgE' },
  ],
}

Meteor.startup(() => {
  if (Degree.find().count() === 0) {
    data.degrees.forEach((degree) => {
      const newDegree = new Degree(degree)
      newDegree.save()
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
        instructor: {
          _id: teachers[1]._id,
          firstName: teachers[1].profile.firstName,
          lastName: teachers[1].profile.lastName,
        },
      },
      laboratory: {},
      students: [],
      sessions: [],
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
    course.createSession(new Date('01/27/17'))
    course.save()
    const session = Session.find().fetch()[0]
    session.activities.push({
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
