/* eslint-disable no-alert */
import Course from '/imports/both/models/Course'

import { Component, State, Inject } from 'angular2-now'
import '../views/course-upsert.html'

@State({
  name: 'app.course.create',
  url: '/subjects/create',
})

@Component({
  selector: 'course-upsert',
  templateUrl: 'imports/client/views/course-upsert.html',
})
@Inject('$scope', '$reactive', '$state', '$stateParams')
class CourseUpsertComponent {
}

export default CourseUpsertComponent
