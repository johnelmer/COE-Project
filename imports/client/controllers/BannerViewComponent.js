import { Component, State, bootstrap } from 'angular2-now'
import './init.js'
import '../views/banner-view.html'

import _ from 'underscore'

@Component({
  selector: 'banner',
  templateUrl: 'imports/client/views/banner-view.html',
  transclude: true,
  replace: true
})
export default class BannerViewComponent {
  constructor() {
  }
}

bootstrap(BannerViewComponent)
