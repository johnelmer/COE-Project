import SetupCollection from '../decorators/SetupCollection'
// import schema from '../schemas/Degree' TODO: make degree schema

import Model from './Model'

@SetupCollection('Degrees')
class Degree extends Model {

  // static schema = schema
}

export default Degree
