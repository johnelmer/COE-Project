import Notification from '/imports/both/models/Notification'
import User from '/imports/both/models/User'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/notification.html'

@State({
	name: 'app.notification.show',
  url: '/notification',
  resolve: {
    // redirect($auth, $location) {
    //   $auth.awaitUser().then((user) => {
    //     if (user.hasRole('faculty')) {
    //       $location.path('/login')
    //     }
    //   })
    // },
  },
})
@Component({
  selector: 'notification-view',
  templateUrl: 'imports/client/views/notification.html',
})
@Inject('$scope', '$reactive', '$stateParams', '$state')
class NotificationComponent {
  // static schema = schema
  constructor($scope, $reactive, $stateParams, $state) {
    $reactive(this).attach($scope)
    this.subscribe('notifications')
    this.helpers({
      notifications() {
        const user = Meteor.user()
        if (user) {
          return user.notifications
        }
        return []
      }
    })
  }
}

export default NotificationComponent
