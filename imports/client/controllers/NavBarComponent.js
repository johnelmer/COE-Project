import { Meteor } from 'meteor/meteor'
import { Component, Inject } from 'angular2-now'
import 'bootstrap-sass/assets/javascripts/bootstrap.min.js'
import 'ng-toast/dist/ngToast.css'
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
      const users = this.subscribe('currentUser')
      const roles = this.subscribe('roles')
      const notifications = this.subscribe('notifications')
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
