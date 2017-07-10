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
    console.log(this.classType);
    const { templateId } = $stateParams
    this.activity = { name: '', percentage: '', isMultiple: false }
    // this.total = {lecture: { percentage: '' }, laboratory: { percentage: '' }}
    const subs = this.subscribe('grading-templates')
    this.helpers({
      docs() {
        if (subs.ready()) {
          const isCreate = $state.current.name.endsWith('create')
        //  console.log(templateId)
          //console.log(GradingTemplate.findOne({ _id: templateId }));
        const temp = (isCreate) ? new GradingTemplate() : GradingTemplate.findOne({ _id: templateId })
          const activityList = []
           console.log(temp);
          if (!isCreate) {
             activityList.push(...temp.lecture.activityTypes.map((type) => {
               type.category = 'lecture'
               return type
             }))
             if (temp.laboratory) {
               activityList.push(...temp.laboratory.activityTypes.map((type) => {
                 type.category = 'laboratory'
               }))
             }
          } else {
            temp.lecture = { percentage: '', activityTypes: [] }
          }
          return { gradingTemplate: temp, activityList: activityList }
        }

      },
    })
  }
  addActivity() {
    console.log(this.docs);
  }

  save() {

  }
}
export default CustomGradingTemplateComponent
