import SetupCollection from '../decorators/SetupCollection'
import Schemas from '../Schemas'

import Model from './Model'

@SetupCollection('Subjects')
class Subject extends Model {

  static schema = Schemas.subject

  assignTeacher(teacher) {
    this.teachersAssigned.push({
      _id: teacher._id,
      firstName: teacher.firstName,
      lastName: teacher.lastname,
    })
  }

  removeTeacher(teacherId) {
    this.removeObjectFromArray('teachersAssigned', '_id', teacherId)
  }
}

export default Subject
