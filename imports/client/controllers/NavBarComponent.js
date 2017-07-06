import { Meteor } from 'meteor/meteor'
import { Component, Inject } from 'angular2-now'
import '../views/nav-bar.html'

@Component({
  selector: 'nav-bar',
  templateUrl: 'imports/client/views/nav-bar.html',
})
@Inject('$scope', '$reactive', 'ngToast')

class NavBarComponent {

  constructor($scope, $reactive, ngToast) {
    $reactive(this).attach($scope)
    this.user = this.currentUser
    this.ngToast = ngToast
    this.autorun(() => {
      const users = this.subscribe('users')
      const roles = this.subscribe('roles')
      const subs = [users, roles]
      const subsReady = subs.every(sub => sub.ready())
      if (subsReady) {
        this.user = Meteor.user()
      }
    })
  }

  logout() {
    Meteor.logout()
  }
}

export default NavBarComponent
