import { Component, State, bootstrap } from 'angular2-now'
import './init.js'
import '../views/app.html'

import _ from 'underscore'

@State({
	name: 'app',
	abstract: true,
	html5Mode: true,
})
@State({
  name: 'app.student',
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
