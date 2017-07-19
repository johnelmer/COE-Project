import { Component, State, Inject } from 'angular2-now'
import AppSetting from '/imports/both/models/AppSetting'
import { Meteor } from 'meteor/meteor'
import '../views/change-password.html'

@State({
  name: 'app.settings.changePassword',
  url: '/settings/changepassword',	
})
@Component({
  selector: 'settings-changePassword',
  templateUrl: 'imports/client/views/change-password.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class ChangePasswordComponent {
  constructor($scope, $reactive, $state, $stateParams) {
    $reactive(this).attach($scope)
    this.subscribe('settings')
    this.subscribe("currentUser")
    this.user = Meteor.user()

  }
  save() {
    this.user.changePassword(oldPassword, newPassword, (err, doc) => {
      console.log(err)
    })
  }
}

export default ChangePasswordComponent