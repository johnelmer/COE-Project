import Student from '/imports/both/models/Student'
import AppSetting from '/imports/both/models/AppSetting'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/student-courses.html'

@State({
  name: 'app.student.courses',
  url: '/student/courses/:studentId',
  resolve: {
    redirect: ['$location', ($location) => {
      const isAuthorized = Meteor.user() && Meteor.user().hasARole('faculty')
      return isAuthorized || $location.path('/login')
    }],
  },
})
@Component({
  selector: 'student-courses',
  templateUrl: 'imports/client/views/student-courses.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class StudentCoursesComponent {

  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    const { studentId } = $stateParams
    this.subscribe('students', () => {
      const courseSubs = this.subscribe('courses')
      const sessionSubs = this.subscribe('sessions')
      const activitySubs = this.subscribe('activities')
      const activityTypeSubs = this.subscribe('activity-types')
      const gradingSubs = this.subscribe('grading-templates')
      const settingSubs = this.subscribe('settings')
      const gradeTransmutationSubs = this.subscribe('grade-transmutations')
      this.student = Student.findOne({ _id: studentId })
      const student = this.student
      if (courseSubs.ready() && sessionSubs.ready() && activitySubs.ready()
          && activitySubs.ready() && activityTypeSubs.ready() && gradingSubs.ready()
          && settingSubs.ready() && gradeTransmutationSubs.ready() && student) {
        this.records = student.coursesGrades
        const settings = AppSetting.findOne()
        this.selectedSchoolYear = settings.currentSchoolYear
        this.selectedSemester = settings.currentSemester
      }
    })
  }

  get filteredRecords() {
    const records = this.records
    if (records) {
      return this.records.filter((record) => {
        const course = record.course
        return course.schoolYear === this.selectedSchoolYear &&
          course.semester === this.selectedSemester
      })
    }
    return []
  }

  changeSemester(semester) {
    this.selectedSemester = semester
  }

  changeSchoolYear(schoolYear) {
    this.selectedSchoolYear = schoolYear
  }

  get schoolYearList() {
    const currentYear = new Date().getFullYear()
    const startYear = 2017
    if ((currentYear - startYear) >= 0) {
      const list = []
      for (let i = 0; i <= currentYear - startYear; i += 1) {
        list.push(`${startYear + i}-${startYear + i + 1}`)
      }
      return list
    }
    return []
  }

  get semesterList() {
    return AppSetting.schema._schema.currentSemester.allowedValues
  }
}

export default StudentCoursesComponent
