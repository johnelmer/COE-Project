import { Meteor } from 'meteor/meteor'
import { Component, Inject } from 'angular2-now'
import '../views/nav-bar.html'

@Component({
  selector: 'nav-bar',
  templateUrl: 'imports/client/views/nav-bar.html',
})
@Inject('$scope', '$reactive')

class NavBarComponent {

  constructor($scope, $reactive) {
    $reactive(this).attach($scope)
    this.isHidden = true
    this.user = Meteor.user()
    this.subscribe('users', () => {
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
  }

  logout() {
    Meteor.logout()
  }

}

export default NavBarComponent
