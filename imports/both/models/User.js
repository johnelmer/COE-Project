import _ from 'underscore'

import Model from './Model'
import SetupAccount from '../decorators/SetupAccount'

@SetupAccount
class User extends Model {

  setRole(role) {
    if (role === 'Dean') {
      throw new Error('Not allowed!')
    }
    this.profile.role = role
  }

  assignSubject(subject) {
    const subjectDoc = subject
    delete subjectDoc.courses
    delete subjectDoc.teachersAssigned
    this.profile.subjectsAssigned.push(subjectDoc)
  }

  removeSubjectAssignment(subjectId) {
    this.removeObjectFromArray('subjects', '_id', subjectId)
  }

  addSubjectAssignment(subject, teacher) {
    teacher.assignSubject(subject)
    subject.assignTeacher(teacher)
  }

  addCourse(course) {
    const courseDoc = course
    const subject = course.subject
    delete subject.courses
    delete subject.teachersAssigned
    courseDoc.subject = subject
    delete courseDoc.sessions
    delete courseDoc.students
    this.profile.courses.push(courseDoc)
  }

}

export default User
