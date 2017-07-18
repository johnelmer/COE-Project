import { Component, State, Inject } from 'angular2-now'
import AppSetting from '/imports/both/models/AppSetting'
import '../views/settings.html'

@State({
  name: 'app.settings.update',
  url: '/settings/update',
})
@Component({
  selector: 'settings-update',
  templateUrl: 'imports/client/views/settings.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class SettingsComponent {
  constructor($scope, $reactive, $stateParams, $state) {
    $reactive(this).attach($scope)
    this.subscribe('settings')
    this.helpers({
      setting() {
        return AppSetting.findOne()
      }
    })
  }
  save() {
    const setting = this.setting
    setting.currentSemester = this.semester
    setting.currentSchoolYear = this.schoolYear
    console.log(setting);
    this.setting.save(err => {
      if (err) {
        console.log(err);
      }
    })
  }
}
export default SettingsComponent
