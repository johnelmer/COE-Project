import {Component, State} from 'angular2-now'
import '../views/login-view.html'

@State({
  name: 'app.login',
  url: '/login'
})
@Component({
  selector: 'login-view',
  templateUrl: 'imports/client/views/login-view.html'
})
class LoginComponent {
  //something ...
}
export default LoginComponent
