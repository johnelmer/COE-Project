import User from '/imports/both/models/User' // TODO: double check if this line of code is not needed
import schema from '/imports/both/schemas/User'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Component, State, Inject } from 'angular2-now'
// import ngToast from '/node_modules/ng-toast'
import '../views/login-view.html'
import 'ng-toast/dist/ngToast.css'
// import User from '/imports/both/models/User'
// TODO: double check if the user import code is not needed

@State({
  name: 'app.login',
  url: '/login',
  resolve: {
    redirect($location) {
      const hasUser = Meteor.user()
      return !hasUser || $location.path('/teacher/courses')
    },
  },
  defaultRoute: true,
})
@Component({
  selector: 'login-view',
  templateUrl: 'imports/client/views/login-view.html',
})
@Inject('$scope', '$reactive', '$state', 'ngToast')
class LoginComponent {
  static schema = schema
  constructor($scope, $reactive, $state, ngToast) {
    $reactive(this).attach($scope)
    this.userContext = schema.namedContext()
    this.user = {}
    this.$state = $state
    this.ngToast = ngToast
  }

  login() {
    this.validateFields()
    if (this.isInvalidUsername || this.isInvalidPassword) {
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: 'Please fill in the fields completely!',
      })
    } else {
      Meteor.loginWithPassword(this.user.username, this.user.password, (err) => {
        if (err) {
          this.ngToast.create({
            dismissButton: true,
            className: 'danger',
            content: `${err.reason}!`,
          })
          if (err.reason.includes('User')) {
            this.user = null;
          } else if (err.reason.includes('password')) {
            this.user.password = null;
          }
        } else {
          this.$state.go('app.teacher.main')
        }
      })
    }
  }

  validateFields() {
    this.validateUsername()
    this.validatePassword()
  }

  validateUsername() {
    if (this.userContext.validateOne(this.user, 'username')) {
      this.isInvalidUsername = false
    } else {
      this.isInvalidUsername = true
      this.usernameErrorMessage = this.userContext.keyErrorMessage('username')
    }
  }

  validatePassword() {
    if (this.user.password === '' || this.user.password === null) {
      this.isInvalidPassword = true
      this.passwordErrorMessage = 'Please fill in your password'
    } else {
      this.isInvalidPassword = false
    }
  }
}

export default LoginComponent
