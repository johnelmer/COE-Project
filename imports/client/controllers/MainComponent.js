import { Component, State, bootstrap } from 'angular2-now'
import './init'
import '../views/app.html'

@State({
  name: 'app',
  abstract: true,
  html5Mode: true,
})
@State({
  name: 'app.student',
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
@Component({
  selector: 'app',
  templateUrl: 'imports/client/views/app.html',
  transclude: true,
  replace: true,
})
export default class MainComponent {
}

bootstrap(MainComponent)
