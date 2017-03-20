import SetupCollection from '../decorators/SetupCollection'

import Model from './Model'

@SetupCollection('Activities')
class Activity extends Model {
  // schema here...

  addScore(score, studId) {
    const index = this.scores.findIndex((scr) => {
      if (scr.studentId === studId && score !== undefined) {
        return scr
      }
      return -1;
    })

    if (index !== -1) {
      this.scores.splice(index, 1)
      this.scores.push(score)
    }
  }
}

export default Activity
