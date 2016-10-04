import {Component,State,Inject} from 'angular2-now'
import '../views/login-view.html'

import User from '/imports/both/models/User'

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

    constructor($scope, $reactive, $state, $stateParams) {
        $reactive(this).attach($scope)
        this.message = ""

    }


}

export default StudentUpsertComponent
