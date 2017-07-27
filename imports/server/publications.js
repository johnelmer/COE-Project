import { Meteor } from 'meteor/meteor'
import _ from 'underscore'
import Course from '/imports/both/models/Course'
import Student from '/imports/both/models/Student'
import Subject from '/imports/both/models/Subject'
import Degree from '/imports/both/models/Degree'
import Department from '/imports/both/models/Department'
import User from '/imports/both/models/User'
import Role from '/imports/both/models/Role'
import Activity from '/imports/both/models/Activity'
import ActivityType from '/imports/both/models/ActivityType'
import Session from '/imports/both/models/Session'
import AppSetting from '/imports/both/models/AppSetting'
import GradingTemplate from '/imports/both/models/GradingTemplate'
import Meeting from '/imports/both/models/Meeting'
import Notification from '/imports/both/models/Notification'
import GradeTransmutation from '/imports/both/models/GradeTransmutation'

Meteor.publish('courses', () => Course.find())


Meteor.publish('students', () => {
  const opts = {
    sort: {
      lastName: 1,
    },
  }
  return Student.find({}, opts)
}
)

Meteor.publish('students-basic-infos', () => {
  const opts = {
    fields: {
      firstName: 1,
      lastName: 1,
      idNumber: 1,
      degree: 1,
      yearLevel: 1,
    },
  }
  return Student.find({}, opts)
})

Meteor.publish('student', (id) => {
  return Student.find({ _id: id })
})

Meteor.publish('subjects', () => Subject.find())

Meteor.publish('degrees', () => Degree.find())

Meteor.publish('departments', () => Department.find())

Meteor.publish('teachers', () => {
  const users = User.find({},
    { fields: { firstName: 1, middleName: 1, lastName: 1, roleName: 1, courseIds: 1 } }).fetch()
  const teacherIds = users.filter(user => user.hasARole('faculty')).map(teacher => teacher._id)
  return User.find({ _id: { $in: teacherIds } })
})

Meteor.publish('users', () => User.find({}, { fields: { services: 0 } }))
Meteor.publish('user', id => User.find({ _id: id }, { fields: { services: 0 } }))

Meteor.publish('currentUser', function () {
  return User.find({ _id: this.userId })
})

Meteor.publish('roles', () => Role.find())

Meteor.publish('activities', () => Activity.find())

Meteor.publish('activity-types', () => ActivityType.find({}, { fields: { name: 1 } }))

Meteor.publish('sessions', () => Session.find())

Meteor.publish('settings', () => AppSetting.find())

Meteor.publish('grading-templates', () => GradingTemplate.find())


Meteor.publish('meetings', () => Meeting.find())

Meteor.publish('notifications', () => Notification.find())

Meteor.publish('grade-transmutations', () => GradeTransmutation.find())

Meteor.publish('teacherCourses', (teacherId) => { // eslint-disable-line
  const user = User.findOne({ _id: teacherId })
  return Course.find({ _id: { $in: user.courseIds } })
})
