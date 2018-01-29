import { Component, State, Inject } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import AppSetting from '/imports/both/models/AppSetting'
import schema from '/imports/both/schemas/AppSetting'
import '../views/settings.html'

@State({
  name: 'app.settings.update',
  url: '/settings/update',
  resolve: {
    redirect($location) {
      const isAuthorized = Meteor.user() && Meteor.user().hasARole('dean')
      return isAuthorized || $location.path('login')
    },
  },
})
@Component({
  selector: 'settings-update',
  templateUrl: 'imports/client/views/settings.html',
})
@Inject('$scope', '$reactive', '$stateParams', '$state')
class SettingsComponent {
  static schema = schema
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
    try {
      schema.validate(this.setting.doc)
      this.setting.save((err) => {
        if (err) {
          this.ngToast.create({
            dismissButton: true,
            className: 'danger',
            content: `${err.reason}`,
          })
        }
      })
      this.ngToast.create({
        dismissButton: true,
        className: 'success',
        content: 'Semester and Academic Year Successfully Changed!',
      })
    } catch (e) {
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: `${e.reason}`,
      })
    }

  }
}
export default SettingsComponent
