import { Meteor } from 'meteor/meteor'
import { Component, Inject } from 'angular2-now'
import '../views/nav-bar.html'

// @State({
//   name: 'app.navBar',
// })
@Component({
  selector: 'nav-bar',
  templateUrl: 'imports/client/views/nav-bar.html',
})
@Inject('$scope', '$reactive')

class NavBarComponent {
  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.subscribe('users', () => {
      this.isHidden = false
      if (Meteor.user() === null) {
        this.isHidden = true
      }
    })
  }
  logout() {
    Meteor.logout()
  }
}

export default NavBarComponent
