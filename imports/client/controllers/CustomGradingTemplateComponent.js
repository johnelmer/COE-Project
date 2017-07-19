import { Component, State, Inject } from 'angular2-now'
import '../views/custom-grading-template.html'
import GradingTemplate from '/imports/both/models/GradingTemplate'

@State({
  name: 'app.template.create',
  url: '/teacher/course/gradingtemplate/create',
})
@State({
  name: 'app.template.update',
  url: '/teacher/course/gradingtemplate/update/:templateId',
})
@Component({
  selector: 'grading-template',
  templateUrl: 'imports/client/views/custom-grading-template.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class CustomGradingTemplateComponent {
  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    this.classType = 'lecture'
    const { templateId } = $stateParams
    this.activity = { name: '', percentage: '', isMultiple: false }
    this.subscribe('grading-templates', () => {
      this.subscribe('settings')
      console.log(GradingTemplate.findOne(templateId))
      const isCreate = $state.current.name.endsWith('create')
      const gradingTemplate = (isCreate) ? new GradingTemplate({
        lecture: {
          percentage: '', activityTypes: [],
        },
        laboratory: {
          percentage: '', activityTypes: [],
        },
      }) : GradingTemplate.findOne({ _id: templateId })
      const activityList = []
      let total = {}
      if (gradingTemplate) {
        if (!isCreate) {
          const hasLaboratory = (gradingTemplate) ? gradingTemplate.hasOwnProperty('laboratory') : false
          this.hasLaboratory = hasLaboratory
          total = {
            lecture: { percentage: gradingTemplate.lecture.percentage },
            passingPercentage: gradingTemplate.passingPercentage,
          }
          if (hasLaboratory) {
            total.laboratory = { percentage: gradingTemplate.laboratory.percentage }
          }
          activityList.push(...gradingTemplate.lecture.activityTypes.map((type) => {
            type.category = 'lecture'
            return type
          }))
          if (gradingTemplate.laboratory) {
            activityList.push(...gradingTemplate.laboratory.activityTypes.map((type) => {
              type.category = 'laboratory'
              return type
            }))
          }
        } else {
          this.hasLaboratory = false
          total = {
            lecture: { percentage: 100 },
            laboratory: { percentage: 0 },
            passingPercentage: 50,
          }
          // gradingTemplate.lecture = { percentage: '', activityTypes: [] }
          // gradingTemplate.laboratory = { percentage: '', activityTypes: [] }
        }
      }
      
      this.gradingTemplate = gradingTemplate
      this.activityList = activityList
      this.total = total
    })
  }
  addActivity() {
    const activity = this.activity
    const act = {
      name: activity.name,
      percentage: parseInt(activity.percentage, 10),
      isMultiple: activity.isMultiple,
      category: this.classType,
    }
    this.gradingTemplate[this.classType].activityTypes.push(act)
    this.gradingTemplate.isDefault = false
    this.activityList.push(act);
  }

  save() {
    const gradingTemplate = this.gradingTemplate
    const total = this.total
    const hasLaboratory = this.hasLaboratory
    const lab = gradingTemplate.laboratory.activityTypes
    gradingTemplate.passingPercentage = parseInt(total.passingPercentage, 10)
    gradingTemplate.lecture.percentage = parseInt(total.lecture.percentage, 10)
    if (hasLaboratory) {
      console.log('hh')
      gradingTemplate.laboratory.percentage = parseInt(total.laboratory.percentage, 10)
    } else {
      delete gradingTemplate.laboratory
    }
    gradingTemplate.save((doc, err) => {
      console.log(doc);
      console.log(err);
      if (err) {
        console.log(err);
      }
    })
  }
}
export default CustomGradingTemplateComponent
