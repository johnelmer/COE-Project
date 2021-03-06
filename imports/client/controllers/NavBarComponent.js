import { Meteor } from 'meteor/meteor'
import { Component, Inject } from 'angular2-now'
import 'bootstrap-sass/assets/javascripts/bootstrap.min.js'
import 'ng-toast/dist/ngToast.css'
import '../views/nav-bar.html'
// import '../styles/navBar.scss'

@Component({
  selector: 'nav-bar',
  templateUrl: 'imports/client/views/nav-bar.html',
})
@Inject('$scope', '$reactive', '$state', 'ngToast')
class NavBarComponent {

  constructor($scope, $reactive, $state, ngToast) {
    $reactive(this).attach($scope)
    this.user = this.currentUser
    this.ngToast = ngToast
    this.$state = $state
    this.autorun(() => {
      const users = this.subscribe('currentUser')
      const roles = this.subscribe('roles')
      const notifications = this.subscribe('notifications')
      const subs = [users, roles, notifications]
      const subsReady = subs.every(sub => sub.ready())
      if (subsReady) {
        this.user = Meteor.user()
      }
    })
  }

  toggle() {
    document.querySelector('#brand').classList.toggle('change')
  }

  logout() {
    Meteor.logout((err) => {
      if (err) {
        alert(err)
      } else {
        this.$state.go('app.login')
      }
    })
  }
}

export default NavBarComponent
