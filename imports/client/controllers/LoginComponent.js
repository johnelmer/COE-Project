import {Component,State,Inject} from 'angular2-now'
import '../views/login-view.html'

@State({
    name: 'app.login',
    url: '/login'
})
@Component({
    selector: 'login-view',
    templateUrl: 'imports/client/views/login-view.html'
})

@Inject('$scope', '$reactive', '$state', '$stateParams')
class LoginComponent {
    constructor($scope, $reactive) {
        $reactive(this).attach($scope)
    }
}
export default LoginComponent
