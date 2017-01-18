import { Component, State, Inject } from 'angular2-now'
import '../views/login-view.html'
import User from '/imports/both/models/User'
import { Meteor } from 'meteor/meteor'

@State({
  name: 'app.login',
  url: '/login',
})

@Component({
  selector: 'login-view',
  templateUrl: 'imports/client/views/login-view.html',
})
@Inject('$scope', '$reactive', '$state')
class LoginComponent {
  constructor($scope, $reactive, $state) {
    $reactive(this).attach($scope)
    this.user = {}
    this.$state = $state
  }
  login() {
    Meteor.loginWithPassword(this.user.username, this.user.password, (err) => {
      if (err) {
        alert(`${err.reason}`)
      } else {
        this.$state.go('app.student')
      }
    })
  }
}

export default LoginComponent
