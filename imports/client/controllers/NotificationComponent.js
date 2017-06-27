import schema from '/imports/both/schemas/Notification'
import Notification from '/imports/both/models/Notification'
import User from '/imports/both/models/User'
import { Meteor } from 'meteor/meteor'
import { Component, State, Inject } from 'angular2-now'
import '../views/notification.html'

@State({
	name: 'app.notification.alert',
  url: '/notification',
  resolve: {
    redirect($auth, $location) {
      $auth.awaitUser().then((user) => {
        if (user.hasRole('faculty')) {
          $location.path('/login')
        }
      })
    },
  },
})
@Component({
  selector: 'notification',
  templateUrl: 'imports/client/views/notification.html',
})
@Inject('scope', '$reactive', '$stateParams')

class NotificationComponent {
  static schema = schema
  constructor($scope, $reactive, $stateParams) {
    $reactive(this).attach($scope)
    this.subscribe('notifications')
  }
}

export default NotificationComponent