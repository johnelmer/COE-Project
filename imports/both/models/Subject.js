import SetupCollection from '../decorators/SetupCollection'
import { override } from 'core-decorators'

import Model from './Model'

@SetupCollection('Subjects')
class Subject extends Model {
  constructor(doc) {
  	super(doc)
  }
@override
  save(callback) {
    super.save(callback)
  }
}

export default Subject