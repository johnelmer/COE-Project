import angular from 'angular'
import angularMeteor from 'angular-meteor'
import {init,SetModule} from 'angular2-now'
import angularUiBootstrap from 'angular-ui-bootstrap'
import ngAnimate from 'angular-animate'
import ngTouch from 'angular-touch'
import ngSanitize from 'angular-sanitize'
import uiRouter from 'angular-ui-router'
import uiSelect from 'ui-select'

init()
const dependencies = [
<<<<<<< HEAD
    angularMeteor,
    angularUiBootstrap,
    ngAnimate,
    ngTouch,
    ngSanitize,
    uiRouter,
    uiSelect
=======
  angularMeteor,
  angularUiBootstrap,
  ngAnimate,
  ngTouch,
  ngSanitize,
  uiRouter,
  uiSelect,
>>>>>>> d04086e6aa015e91d9130dbd391c3be2600c2326
]
SetModule('app', dependencies)
