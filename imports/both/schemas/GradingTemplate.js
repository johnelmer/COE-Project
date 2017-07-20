import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import AppSetting from '/imports/both/models/AppSetting'

const activityType = new SimpleSchema({
  name: {
    type: String,
  },
  percentage: {
    type: Number,
  },
  isMultiple: {
    type: Boolean,
  },
})

const classType = new SimpleSchema({
  percentage: {
    type: Number,
  },
  activityTypes: {
    type: [activityType],
  },
})

export default new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['Semester Term', 'Summer Term'],
    autoValue: function () {
      if (this.isInsert) {
        const setting = AppSetting.findOne()
        if (setting.currentSemester === 'First Semester' || setting.currentSemester === 'Second Semester') {
          return 'Semester Term'
        } else {
          return 'Summer Term'
        }
      }
      this.unset();
    },
  },
  description: {
    type: String,
    optional: true,
  },
  isApproved: {
    type: Boolean,
  },
  isDefault: {
    type: Boolean,
  },
  lecture: {
    type: classType,
  },
  laboratory: {
    type: classType,
    optional: true,
  },
  'laboratory.type': {
    type: String,
    allowedValues: [
      'Computational', 'With Hands-on', 'SE Subject',
    ],
    optional: true,
  },
  passingPercentage: {
    type: Number,
    defaultValue: 50,
  },
  courseIds: {
    type: [String],
    optional: true,
  },
  // isApproved: {
  //   type: Boolean,
  // },
})
