import { Meteor } from 'meteor/meteor'

import loadAccounts from './startup'
import Degree from '/imports/both/models/Degree'
import Student from '/imports/both/models/Student'
import Course from '/imports/both/models/Course'
import Subject from '/imports/both/models/Subject'
import User from '/imports/both/models/User'

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
      address: 'Pavia',
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
      address: 'New Lucena',
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
      address:  'Angas',
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
      address: 'GenSan',
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
      address: 'Roxas',
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
        status: 'Full-time Faculty',
        contactNumber: '09161628911',
        address: 'Pavia',
        department: 'SE',
        birthday: new Date('07/22/96'),
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
        status: 'Part-time Faculty',
        idNumber: '04-1134-12',
        contactNumber: '09262527921',
        address: 'Jaro',
        department: 'SE',
        birthday: new Date('07/12/96'),
      },
    },
  ],
  subjects: [
    {
      name: 'SE',
      courseNumber: '4102',
      credits: 3.0,
      units: 3.0,
      isOffered: true,
    },
    {
      name: 'SE',
      courseNumber: '4201',
      credits: 3.0,
      units: 3.0,
      isOffered: false,
    },
    {
      name: 'EMath',
      courseNumber: '2001',
      credits: 3.0,
      units: 3.0,
      isOffered: true,
    },
    {
      name: 'Engr',
      courseNumber: '301',
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
    const subjects = Subject.find().fetch()
    const teachers = User.find().fetch()
    subjects[1].generateCourse({
      stubcode: '123',
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
      semester: '2016-2017',
    })
    subjects[0].save()
  }
})
