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
@Inject('$scope', '$reactive', 'ng-toast')

class NavBarComponent {
  constructor($scope, $reactive, ngToast) {
    $reactive(this).attach($scope)
    this.subscribe('users', () => {
      this.isHidden = true
      if (Meteor.user() !== null && Meteor.user() !== undefined) {
        this.isHidden = false
        this.isFacultyTabHidden = false
        this.isStudentTabHidden = false
        this.isSubjectAssignmentHidden = false
        this.isDegreeTabHidden = false
        this.isDepartmentTabHidden = false
        if (Meteor.user().roleName === 'department head') {
          this.isFacultyTabHidden = true
          this.isStudentTabHidden = true
        } else if (Meteor.user().roleName === 'faculty') {
          this.isFacultyTabHidden = true
          this.isStudentTabHidden = true
          this.isSubjectAssignmentHidden = true
          this.isDegreeTabHidden = true
          this.isDepartmentTabHidden = true
        }
      }
    })
    this.ngToast = ngToast
  }
  logout() {
    Meteor.logout((err) => {
      this.ngToast.create({
        dismissButton: true,
        className: 'danger',
        content: `${err.reason}`,
      })
    })
  }
}

export default NavBarComponent
