<<<<<<< HEAD
<<<<<<< HEAD
=======
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
=======
>>>>>>> b8b11e476858487767c0564e592165fa64cc87c6
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
<<<<<<< HEAD
=======
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
>>>>>>> backend-branch
=======
>>>>>>> 2083728d60a97d88a32afab71e6f4f510f0388f7
>>>>>>> b8b11e476858487767c0564e592165fa64cc87c6
