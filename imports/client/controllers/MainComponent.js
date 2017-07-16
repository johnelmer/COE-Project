import { Component, State, bootstrap } from 'angular2-now'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import './init'
import '../views/app.html'

@State({
  name: 'app',
  abstract: true,
  resolve: {
    user() {
      return new Promise((resolve) => {
        Tracker.autorun(() => {
          const userSub = Meteor.subscribe('currentUser')
          if (userSub.ready()) {
            resolve(Meteor.user())
          }
        })
      })
    },
  },
  html5Mode: true,
})
@State({
  name: 'app.student',
  abstract: true,
})
@State({
  name: 'app.tmp',
  abstract: true,
})
@State({
  name: 'app.subject',
  abstract: true,
})
@State({
  name: 'app.teacher',
  abstract: true,
})
@State({
  name: 'app.degree',
  abstract: true,
})
@State({
  name: 'app.department',
  abstract: true,
})
@State({
  name: 'app.course',
  abstract: true,
})
@State({
  name: 'app.course.session',
  abstract: true,
})
@State({
  name: 'app.meeting',
  abstract: true,
})
@State({
  name: 'app.course.assign',
  abstract: true,
})
@State({
  name: 'app.notification',
  abstract: true,
})
@State({
  name: 'app.template',
  abstract: true,
})
@State({
  name: 'app.settings',
  abstract: true,
})
@Component({
  selector: 'app',
  templateUrl: 'imports/client/views/app.html',
  transclude: true,
  replace: true,
})
export default class MainComponent {
}

bootstrap(MainComponent)
