import SetupCollection from '../decorators/SetupCollection'
import schema from '../schemas/Activity'

import Model from './Model'

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
        studentFirstName: student.firstName,
        studentLastName: student.lastName,
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
}

export default Activity
