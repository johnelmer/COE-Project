import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'

@SetupCollection('Subjects')
class Subject extends Model {

  static schema = Schemas.subject

  hasLaboratory() {
    return this.laboratory instanceof 'object'
  }

  assignTeacher(teacher) {
    this.teachersAssigned.push({
      _id: teacher._id,
      firstName: teacher.firstName,
      lastName: teacher.lastname,
    })
  }

  removeTeacher(teacherId) {
    const teachers = this.teachersAssigned
    const index = teachers.findIndex(teacher => teacher._id === teacherId)
    if (index !== -1) {
      teachers.splice(index, 1)
    }
  }
}

export default Subject
