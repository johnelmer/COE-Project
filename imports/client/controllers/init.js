import angular from 'angular'
import angularMeteor from 'angular-meteor'
import { SetModule } from 'ng2now'
import angularUiBootstrap from 'angular-ui-bootstrap'
import ngAnimate from 'angular-animate'
import ngTouch from 'angular-touch'
import ngSanitize from 'angular-sanitize'
import uiRouter from 'angular-ui-router'
import uiSelect from 'ui-select'

const dependencies = [
  angularMeteor,
  angularUiBootstrap,
  ngAnimate,
  ngTouch,
  ngSanitize,
  uiSelect,
  uiRouter
]
SetModule('banner', dependencies)
