/* eslint-env mocha */
import { expect } from 'chai'

describe('Logging in @watch', () => {
  it('Can login a registered user', () => {
    browser.url('http://localhost:3000/')
    browser.setValue('#username', 'Morgan.Buckridge12')
    browser.setValue('#password', 'cpucoe')
    browser.click('#submitButton')
    const doesExist = browser.waitForExist('#navBar')
    expect(doesExist).to.equal(true)
  })
  it('Cannot login an unregistered user', () => {
    browser.url('http://localhost:3000/')
    browser.setValue('#username', 'Morgan')
    browser.setValue('#password', 'cpucoe')
    browser.click('#submitButton')
    browser.waitForExist('#toast')
    const message = browser.getText('#toast')
    expect(message).to.contain('User not found')
  })
  it('Cannot login with empty fields', () => {
    browser.url('http://localhost:3000/')
    browser.setValue('#username', '')
    browser.setValue('#password', '')
    browser.click('#submitButton')
  })
})
