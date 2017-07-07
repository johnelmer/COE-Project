import { Component, State, Inject } from 'angular2-now'
import '../views/settings.html'

@State({
  name: 'app.settings.update',
  url: '/settings/update',
})
@Component({
  selector: 'settings-update',
  templateUrl: 'imports/client/views/settings.html',
})
class SettingsComponent {
  constructor($scope, $reactive, $stateParams) {
    $reactive(this).attach($scope)
  }
}
export default SettingsComponent
