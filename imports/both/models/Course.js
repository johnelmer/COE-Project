import _ from 'underscore'
import { Meteor } from 'meteor/meteor'

import SetupCollection from '../decorators/SetupCollection'
import Idempotent from '../decorators/Idempotent'
import schema from '../schemas/Course'

import Model from './Model'
import Session from './Session'
import Student from './Student'
import GradingTemplate from './GradingTemplate'
import Activity from './Activity'
import Subject from './Subject'
import GradeTransmutation from './GradeTransmutation'

@SetupCollection('Courses')
class Course extends Model {

  static schema = schema

  get hasALaboratory() {
    const laboratory = this.laboratory
    if (laboratory) {
      return Object.keys(laboratory).length !== 0
    }
    return laboratory !== undefined
  }

  enrollAStudent(student) {
    const studentIds = this.studentIds
    if (!this.isStudentEnrolled(student)) {
      studentIds.push(student._id)
    } else {
      throw new Error('Student is already enrolled.')
    }
  }

  isStudentEnrolled(student) {
    return this.studentIds.some(studentId => student._id === studentId)
  }

  @Idempotent
  get students() {
    return Student.find({ _id: { $in: this.studentIds } }, { sort: { lastName: 1 } }).fetch()
  }

  removeStudentFromClass(idNumber) {
    const studentIndex = this.students.findIndex(student => student.studentId === idNumber)
    if (studentIndex === -1) {
      throw new Error('Student is not enrolled on the class.')
    }
    this.students.splice(studentIndex, 1)
  }

  get sessionIds() {
    return _.flatten(this.types.map((type) => {
      const sessions = this[type].sessions
      return (sessions) ? sessions.map(session => session._id) : []
    }))
  }

  get activities() {
    const activities = this.sessions.map(session => session.activities)
    return _.flatten(activities)
  }

  get gradeTransmutation() {
    return GradeTransmutation.findOne({ passingPercentage: this.gradingTemplate.passingPercentage })
  }

  hasActivity(activityType) { // e.g. check if there is already a midterm exam
    const result = Activity.findOne({ type: activityType, sessionId: { $in: this.sessionIds } })
    return result !== undefined
  }

  getFilteredActivities(options) {
    return (options) ? _.flatten(this.sessions.map(session => session.getFilteredActivities(options))) : this.activities
  }

  // returns the activity types list already given by the teacher
  get existingActivityTypes() {
    return this.activityTypes.filter(type => this.hasActivity(type.name))
  }

  // returns current total percentage of all activities already given
  get existingTotalPercentage() {
    const activityTypes = this.existingActivityTypes
    const arrayReduce = (arr) => {
      const length = arr.length
      if (length === 0) {
        return 0
      } else if (length === 1) {
        return arr[0].percentage
      }
      return arr.reduce((acc, cur) => {
        return { percentage: cur.percentage + acc.percentage }
      }).percentage
    }
    if (this.hasALaboratory) {
      const gradingTemplate = this.gradingTemplate
      if (length === 1) {
        return activityTypes[0].percentage * (gradingTemplate[activityTypes[0].name].percentage / 100)
      }
      const lectureActivities = activityTypes.filter(type => type.category === 'lecture')
      const labActivities = activityTypes.filter(type => type.category === 'laboratory')
      const lecturePercentage = arrayReduce(lectureActivities)
      const labPercentage = arrayReduce(labActivities)
      return (lecturePercentage * (gradingTemplate.lecture.percentage / 100)) + (labPercentage * (gradingTemplate.laboratory.percentage / 100))
    }
    return arrayReduce(activityTypes)
  }

  getSessionByDate(date, type) {
    const formattedDate = date.toLocaleDateString()
    const category = this[type]
    const sessions = (!category.sessions) ? category.sessions = [] : this[type].sessions
    const sessionObj = sessions.find((session) => {
      return session.date.toLocaleDateString() === formattedDate
    })
    if (!sessionObj) {
      return Session.findOne({ _id: this.getNewSessionId(formattedDate, type) })
    }
    return Session.findOne({ _id: sessionObj._id })
  }

  getNewSessionId(date, type, callback) {
    const studentAttendances = this.studentIds.map((id) => {
      return { studentId: id, type: 'Present' }
    })
    const sessionId = new Session({
      courseId: this._id,
      type: type,
      studentAttendances: studentAttendances,
      activityIds: [],
      date: date,
    }).save(callback)
    this[type].sessions.push({ _id: sessionId, date: date })
    return sessionId
  }

  get sessions() {
    return (this.isUserHandlesLabOnly) ? this.getFilteredSessions({ type: 'laboratory' }) : Session.find({ courseId: this._id }, { sort: { date: 1 } }).fetch()
  }

  getFilteredSessions(options = {}) {
    options.courseId = this._id
    return Session.find(options, { sort: { date: 1 } }).fetch()
  }

  get gradingTemplate() {
    const gradingTemplate = GradingTemplate.findOne({ _id: this.gradingTemplateId })
    return (!gradingTemplate.isApproved) ? this.defaultGradingTemplate : gradingTemplate
  }

  get customGradingTemplate() {
    const gradingTemplate = GradingTemplate.findOne({ _id: this.gradingTemplateId })
    return (!gradingTemplate.isDefault) ? gradingTemplate : undefined
  }

  get defaultGradingTemplate() {
    const subject = Subject.findOne({ courseNumber: this.subject.courseNumber })
    return (subject) ? subject.defaultGradingTemplate : undefined
  }

  get activityRecords() {
    const activities = this.sessions.map(session => session.activityRecords)
    return _.flatten(activities)
  }

  get studentAttendances() {
    const attendances = this.sessions.map((session) => {
      return session.studentAttendances.map((attendance) => {
        attendance.sessionId = session._id
        attendance.date = session.date.toLocaleDateString()
        attendance.category = session.type
        return attendance
      })
    })
    return _.flatten(attendances)
  }

  get activityTypes() {
    let gradingTemplate = this.gradingTemplate
    if (!gradingTemplate.isApproved) {
      gradingTemplate = this.defaultGradingTemplate
    }
    return (this.isUserHandlesLabOnly) ? gradingTemplate.getActivityTypes('laboratory') : gradingTemplate.getActivityTypes()
  }

  get currentUserHandledTypes() { // returns array with values of Laboratory, Lecture or both
    return this.types.filter(type => this[type].instructor._id === Meteor.userId())
  }

  get isUserHandlesLabOnly() {
    if (this.hasALaboratory) {
      const lectInstructorId = this.lecture.instructor._id
      const labInstructorId = this.laboratory.instructor._id
      return Meteor.userId() === labInstructorId && lectInstructorId !== labInstructorId
    }
    return false
  }

  get types() {
    return (this.hasALaboratory) ? ['lecture', 'laboratory'] : ['lecture']
  }

  get activityTypesWithScores() {
    const activityTypes = this.activityTypes
    const activities = this.activities
    return activityTypes.map((type) => {
      const filteredActivities = activities.filter(activity => activity.type === type.name)
      type.totalScore = 0
      if (filteredActivities.length > 1) {
        return filteredActivities.reduce((acc, cur) => {
          type.totalScore = acc.totalScore + cur.totalScore
          return type
        })
      } else if (filteredActivities.length === 1) {
        type.totalScore = filteredActivities[0].totalScore
        return type
      }
      return type
    })
  }

  get studentsWithRecords() {
    return this.students.map(student => this.getStudentRecords(student))
  }

  getStudentAttendances(student) {
    const attendances = this.studentAttendances
    return attendances.filter(attendance => attendance.studentId === student._id)
                        .map(attendance => _.omit(attendance, 'studentId'))
  }

  get classRecord() { // returns all data that can be extracted to form easily a class record
    const records = this.studentsWithRecords.map(record => _.omit(record, 'course'))
    const sessions = this.sessions.map(session => _.pick(session, 'type', '_id', 'date'))
    const activityTypes = this.activityTypesWithScores
    const activities = this.activities.map(activity => _.omit(activity, 'records'))
    const type = (!this.hasALaboratory) ? 'lecture only' : (this.isUserHandlesLabOnly) ? 'laboratory only' : 'lecture and laboratory'
    return { type: type, sessions: sessions, activityTypes: activityTypes, activities: activities, records: records }
  }

  getStudentQuestPts(student) {
    const records = this.questRecords
    if (records) {
      const index = records.findIndex(record => record.studentId === student._id)
      if (index === -1) {
        return 0
      }
      return records[index].points
    }
    return 0
  }

  getStudentRecords(student) {
    const doc = { activitiesObj: {} }
    const activitiesObj = this.computeStudentActivityRecords(student)
    const ratings = this.gradingTemplate.computeCategoryRatings(activitiesObj)
    const avgLength = ratings.length
    const categoriesDoc = (!this.isUserHandlesLabOnly) ? Object.assign(ratings[0], ratings[1]) : ratings[1]
    const ratingsValues = ratings.map((avg) => {
      return avg[Object.keys(avg)[0]].rating
    })
    doc.finalRating = (avgLength === 1) ? ratings[0][Object.keys(ratings[0])[0]].rating : ratingsValues.reduce((acc, cur) => acc + cur)
    const questPts = this.getStudentQuestPts(student)
    doc.finalRating += questPts
    doc.activitiesObj = activitiesObj
    doc.attendances = this.getStudentAttendances(student)
    const canDetermineFinalGrade = this.activityTypes.filter(type => !type.isMultiple) // get exam activity types
                                    .every(exam => this.hasActivity(exam.name))  // check if each exam is already given
    Object.assign(doc, { student: _.pick(student, '_id', 'fullName', 'idNumber', 'degree', 'yearLevel') }, categoriesDoc)
    doc.finalGrade = (canDetermineFinalGrade) ? this.gradeTransmutation.getGpaByRating(doc.finalRating) : '-'
    let status = '-'
    if (canDetermineFinalGrade) {
      status = (doc.finalGrade === '5.0') ? 'Failed' : 'Passed'
    } else if (this.hasActivity('Midterm Exam') || this.hasActivity('Midsummer Exam')) {
      status = (doc.finalRating < (this.existingTotalPercentage / 2)) ? 'In danger of failing' : 'Passing'
    }
    doc.status = status
    doc.course = _.pick(this, '_id', 'subject', 'stubcode', 'lecture', 'laboratory', 'semester', 'schoolYear')
    return doc
  }

  computeStudentActivityRecords(student) {
    const records = this.activityRecords.filter(record => record.studentId === student._id)
      .map((record) => {
        if (!record.score) {
          record.score = 0
        }
        return record
      })
    const computedRecords = this.computeRecords(records)
    return computedRecords
  }

  get inDangerOfFailingList() {
    return this.studentsWithRecords.filter(record => record.status === 'In danger of failing')
  }

/*  computeActivityPercentages(scoresDoc) {
    const doc = scoresDoc
    this.activityTypesWithScores.forEach((type) => {
      const totalScorePercentage = ((doc[type.name].score / type.totalScore) * 100).toFixed(4)
      const overallPercentage = (totalScorePercentage / 100) * type.percentage
      Object.assign(doc[type.name], { totalScorePercentage: totalScorePercentage, overallPercentage: overallPercentage })
    })
    return doc
  } */

  computeRecords(records) {
    let scoresDoc = {}
    if (records.length > 1) {
      scoresDoc = records.reduce((acc, cur, index, arr) => {
        const activityType = cur.activityType
        if (index === 1) {
          const obj = {}
          const arr1 = arr[0]
          const arr2 = arr[1]
          if (arr1.activityType === arr2.activityType) {
            obj[cur.activityType] = { score: arr1.score + arr2.score }
          } else {
            obj[arr1.activityType] = { score: arr1.score }
            obj[arr2.activityType] = { score: arr2.score }
          }
          return obj
        } else if (index > 1 && !acc[activityType]) {
          acc[activityType] = { score: cur.score }
        } else {
          acc[activityType].score += cur.score
        }
        return acc
      })
    } else if (records.length === 1) {
      const type = records[0].activityType
      scoresDoc[type] = {
        score: 0,
        percentage: 0,
      }
      scoresDoc[type].score = records[0].score
    }
    this.activityTypesWithScores.forEach((type) => {
      const typeName = type.name
      if (scoresDoc[typeName]) {
        const totalScorePercentage = (scoresDoc[type.name].score / type.totalScore) * 100
        const overallRating = (totalScorePercentage / 100) * type.percentage
        scoresDoc[typeName].totalScorePercentage = totalScorePercentage
        scoresDoc[typeName].overallRating = overallRating
        scoresDoc[typeName].records = records.filter(record => record.activityType === typeName)
                                        .map(record => _.pick(record, 'activityId', 'score'))
      }
    })
    return scoresDoc
  }

  passClassRecord() {
    this.activities.forEach((activity) => {
      activity.isLocked = true
      activity.save(err => console.log(err))
    })
    // create notification
  }

}

export default Course
