/* eslint-env mocha */
import Role from '/imports/both/models/Role'
import loadRoles from '/server/fixtures'
import { should } from 'meteor/practicalmeteor:chai'

should()

describe('Role', () => {
  afterEach((done) => {
    Role.remove({})
    done()
  })
  describe('is', () => {
    it('checks if the role it is the name of the role', () => {
      loadRoles()
      const dean = Role.findOne({ name: 'dean' })
      dean.is('dean').should.be.true
    })
  })
  describe('hasARole', () => {
    it('checks if the role is a descendant of the node', () => {
      loadRoles()
      const dean = Role.findOne({ name: 'dean' })
      const conditions = [
        dean.hasARole('dean'),
        dean.hasARole('secretary'),
        dean.hasARole('technician'),
        dean.hasARole('teacher'),
        dean.hasARole('student'),
        dean.hasARole('child'),
      ]
    conditions.every(condition => condition).should.be.true
    })
  })
})
