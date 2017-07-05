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
    // this.subscribe('users')
    this.subscribe('roles')
    this.subscribe('notifications')
    this.ngToast = ngToast
  }
  get isHidden() {
    return !!(Meteor.user())
  }
  get isFaculty() {
    return !!(Meteor.user().hasARole('faculty')) && this.isHidden
  }
  get isDepartmentHead() {
    return !!(Meteor.user().hasARole('department head')) && this.isHidden
  }
  get isSecretary() {
    return !!(Meteor.user().hasARole('secretary')) && this.isHidden
  }
  logout() {
    Meteor.logout()
  }
}

export default NavBarComponent
