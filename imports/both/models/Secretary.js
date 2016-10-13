import SetupCollection from '../decorators/SetupCollection'

import Model from './Model'

class Secretary extends Model {
  Subject subject

  addSubject(stubcode, subjectTitle) {
    this.subject.stubcode = stubcode
    this.subject.subjectTitle = subjectTitle
  }

  get subject() {
    return this.subject
  }
  //specify semester
}

export default Subject