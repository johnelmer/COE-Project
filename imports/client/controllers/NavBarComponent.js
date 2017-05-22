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
    this.user = Meteor.user()
    this.subscribe('users'
    // , () => {
    //   this.isHidden = true
    //   if (Meteor.user() !== null || Meteor.user() !== undefined) {
    //     this.isHidden = false
    //     this.isFacultyTabHidden = false
    //     this.isStudentTabHidden = false
    //     this.isSubjectAssignmentHidden = false
    //     this.isDegreeTabHidden = false
    //     this.isDepartmentTabHidden = false
    //     if (Meteor.user().roleName === 'department head') {
    //       this.isFacultyTabHidden = true
    //       this.isStudentTabHidden = true
    //     } else if (Meteor.user().roleName === 'faculty') {
    //       this.isFacultyTabHidden = true
    //       this.isStudentTabHidden = true
    //       this.isSubjectAssignmentHidden = true
    //       this.isDegreeTabHidden = true
    //       this.isDepartmentTabHidden = true
    //     }
    //   }
    // }
  )
    this.ngToast = ngToast
  }
  get isHidden() {
    return !!(this.user)
  }
  get isFaculty() {
    return !!(this.user.hasARole('faculty')) && this.isHidden
  }
  get isDepartmentHead() {
    return !!(this.user.hasARole('department head')) && this.isHidden
  }
  get isSecretary() {
    return !!(this.user.hasARole('secretary')) && this.isHidden
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
