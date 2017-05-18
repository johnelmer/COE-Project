import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  type: {
    type: String,
  },
  currentSchoolYear: {
    type: String,
  },
  currentSemester: {
    type: String,
    allowedValues: [
      'First Semester',
      'Second Semester',
      'Summer',
    ],
  },
})
