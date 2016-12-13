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
    delete subjectDoc.courseIds
    delete subjectDoc.instructors
    this.profile.subjectsAssigned.push(subjectDoc)
  }

  removeSubjectAssignment(subjectId) {
    const subjects = this.profile.subjectsAssigned
    const index = subjects.findIndex(subject => subject._id === subjectId)
    if (index !== -1) {
      subjects.splice(index, 1)
    }
  }

  addSubjectAssignment(subject, teacher) {
    teacher.assignSubject(subject)
    subject.assignTeacher(teacher)
  }

}

export default User
