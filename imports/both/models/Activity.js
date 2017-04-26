import SetupCollection from '../decorators/SetupCollection'

import schema from '../schemas/Activity'

import Model from './Model'
import Session from './Session'

@SetupCollection('Activities')
class Activity extends Model {

  static schema = schema

  get session() {
    return Session.findOne({ _id: this.sessionId })
  }

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

  get studentRecords() {
    const records = this.records
    const students = this.session.course.students
    return students.map((student) => {
      const recordIndex = records.findIndex(record => record.studentId === student._id)
      if (recordIndex === -1) {
        student.score = ''
      } else {
        student.score = records[recordIndex].score
      }
      return student
    })
  }

  get studentIds() {
    return this.records.map(record => record.studentId)
  }

}

export default Activity
