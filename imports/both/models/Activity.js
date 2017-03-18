import _ from 'underscore'

import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Activity'

import Model from './Model'
import Student from './Student'
import Idempotent from '../decorators/Idempotent'

@SetupCollection('Activities')
class Activity extends Model {

  static schema = schema

  addScore(student, score) {
    const records = this.records
    const index = records.findIndex(record => record.studentId === student._id)
    if (index !== -1) {
      records[index].score = score
    } else {
      records.push({
        studentId: student._id,
        score: score,
      })
    }
  }

  getPassers(passingPercentage) {
    const passingScore = (passingPercentage / 100) * this.totalScore
    return this.records.map(record => record.score >= passingScore)
  }

  getFailures(passingPercentage) {
    const passingScore = (passingPercentage / 100) * this.totalScore
    return this.records.map(record => record.score < passingScore)
  }

  @Idempotent
  get studentRecords() {
     const records = this.records
     const studentIds = this.studentIds
     const students = Student.find({ _id: { $in: studentIds } }, { sort: { lastName: 1 },
       fields: { firstName: 1, lastName: 1, middleName: 1 } }).fetch()
     return students.map((student) => {
       const recordIndex = records.findIndex(record => record.studentId === student._id)
       student.score = records[recordIndex].score
       return student
     })
  }

  get studentIds() {
    return this.records.map(record => record.studentId)
  }

}

export default Activity
