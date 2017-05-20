import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
// import ngToast from '/node_modules/ng-toast'
import '../views/login-view.html'
// import User from '/imports/both/models/User'
// TODO: double check if the user import code is not needed

@State({
  name: 'app.login',
  url: '/login',
  defaultRoute: true,
})
@Component({
  selector: 'login-view',
  templateUrl: 'imports/client/views/login-view.html',
})
@Inject('$scope', '$reactive', '$state', 'ngToast')
class LoginComponent {
  constructor($scope, $reactive, $state, ngToast) {
    $reactive(this).attach($scope)
    this.user = {}
    this.$state = $state
    this.subscribe('users')
    this.ngToast = ngToast
  }
  login() {
    Meteor.loginWithPassword(this.user.username, this.user.password, (err) => {
      if (err) {
        this.ngToast.create({
          dismissButton: true,
          className: 'danger',
          content: `${err.reason}`,
        })
      } else {
        this.$state.go('app.course.teacher')
      }
    })
  }
}

export default LoginComponent
