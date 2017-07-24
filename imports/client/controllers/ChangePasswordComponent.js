import { Component, State, Inject } from 'angular2-now'
import AppSetting from '/imports/both/models/AppSetting'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import '../views/change-password.html'

@State({
  name: 'app.settings.changePassword',
  url: '/settings/changepassword',
  resolve: {
    subs() {
      return new Promise((resolve) => {
        Tracker.autorun(() => {
          const settings = Meteor.subscribe('settings')
          const currentUser = Meteor.subscribe('currentUser')
          const subs = [currentUser, settings]
          const isReady = subs.every(sub => sub.ready())
          if (isReady) {
            resolve(true)
          }
        })
      })
    },
  },
})
@Component({
  selector: 'settings-change',
  templateUrl: 'imports/client/views/change-password.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class ChangePasswordComponent {
  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.user = Meteor.user()
  }

  save() {
    if (this.newPassword === this.retypedPassword) {
      this.user.changePassword(this.oldPassword, this.newPassword, (err) => {
        if (!err) {
          this.oldPassword = ""
          this.newPassword = ""
          this.retypedPassword = ""
          alert("Password changed")
        } else {
          console.log(err)
        }
      })
    } else {
      alert("The retyped password does not match with the new password")
    }
  }
}

export default ChangePasswordComponent
