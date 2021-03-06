import angular from 'angular' //TODO: Check if angular is needed or not
import angularMeteor from 'angular-meteor'
import { init, SetModule } from 'angular2-now'
import angularUiBootstrap from 'angular-ui-bootstrap'
import ngAnimate from 'angular-animate'
import ngTouch from 'angular-touch'
import ngSanitize from 'angular-sanitize'
import uiRouter from '@uirouter/angularjs'
import uiSelect from 'ui-select'
import ngFileUpload from 'ng-file-upload'
import uiGrid from 'angular-ui-grid'
import 'ng-toast'

init()
const dependencies = [
  angularMeteor,
  angularUiBootstrap,
  ngAnimate,
  ngTouch,
  'ngToast',
  ngSanitize,
  uiRouter,
  uiSelect,
  ngFileUpload,
  uiGrid,
  'ui.grid',
  'ui.grid.exporter',
  'ui.grid.selection',
]

SetModule('app', dependencies)
