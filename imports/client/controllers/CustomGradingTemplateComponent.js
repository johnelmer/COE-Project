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
    console.log(this.classType);
    const { templateId } = $stateParams
    this.activity = { name: '', percentage: '', isMultiple: false }
    this.subscribe('grading-templates', () => {
      const isCreate = $state.current.name.endsWith('create')
      const gradingTemplate = (isCreate) ? new GradingTemplate() : GradingTemplate.findOne({ _id: templateId })
      const activityList = []
        if (!isCreate) {
           activityList.push(...gradingTemplate.lecture.activityTypes.map((type) => {
             type.category = 'lecture'
             return type
           }))
           if (temp.laboratory) {
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
    console.log(this.gradingTemplate);
    console.log(this.activity);
    const activity = this.activity
    const act = {
      name: activity.name,
      percentage: activity.percentage,
      isMultiple: activity.isMultiple,
      category: this.classType,
    }
    this.gradingTemplate[this.classType].activityTypes.push(act)
    this.activityList.push(act);
  }

  save() {

  }
}
export default CustomGradingTemplateComponent
