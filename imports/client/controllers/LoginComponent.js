import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import ngToast from '/node_modules/ng-toast'
import '../views/login-view.html'
import User from '/imports/both/models/User' //TODO: double check if this line of code is not needed

@State({
  name: 'app.login',
  url: '/login',
  defaultRoute: true,
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
    this.subscribe('users')
  }
  login() {
    Meteor.loginWithPassword(this.user.username, this.user.password, (err) => {
      if (err) {
        ngToast.create({
          className: 'warning',
          content: '<a href="#" class="">a message</a>',
        })
        alert(`${err.reason}`) // TODO: Change the alert notification
      } else {
        // console.log(Meteor.user().roleName === 'secretary')
        this.$state.go('app.course.teacher') // TODO: define the landing component after login
      }
    })
  }
}

export default LoginComponent
