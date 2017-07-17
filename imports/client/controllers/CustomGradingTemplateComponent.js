import { Component, State, Inject } from 'angular2-now'
import '../views/custom-grading-template.html'
import GradingTemplate from '/imports/both/models/GradingTemplate'

@State({
  name: 'app.template.create',
  url: '/teacher/course/classrecord/gradingtemplate/create',
})
@State({
  name: 'app.template.update',
  url: '/teacher/course/classrecord/gradingtemplate/:templateId',
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
    this.activity = ''
    const { templateId } = $stateParams
    this.activity = { name: '', percentage: '', isMultiple: false }
    this.subscribe('settings')
    this.subscribe('grading-templates', () => {
      const isCreate = $state.current.name.endsWith('create')
      const gradingTemplate = (isCreate) ? new GradingTemplate() : GradingTemplate.findOne({ _id: templateId })
      const activityList = []
        if (!isCreate) {
           activityList.push(...gradingTemplate.lecture.activityTypes.map((type) => {
             type.category = 'lecture'
             return type
           }))
           if (gradingTemplate.laboratory) {
             activityList.push(...gradingTemplate.laboratory.activityTypes.map((type) => {
               type.category = 'laboratory'
             }))
           }
        } else {
          gradingTemplate.lecture = { percentage: '', activityTypes: [] }
          gradingTemplate.laboratory = { percentage: '', activityTypes: [] }
        }
        this.gradingTemplate = gradingTemplate
        this.activityList = activityList
    })
  }
  addActivity() {
    console.log(this.total);
    console.log(this.classType);
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
    console.log(this.total);
    const gradingTemplate = this.gradingTemplate
    const lab = gradingTemplate.laboratory.activityTypes
    gradingTemplate.passingPercentage = this.total.passingPercentage
    gradingTemplate.lecture.percentage = parseInt(this.total.lecture.percentage, 10)
    if (this.total.laboratory.percentage !== undefined) {
      gradingTemplate.laboratory.percentage = parseInt(this.total.laboratory.percentage, 10)
    }
    if (lab.length === 0) {
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
