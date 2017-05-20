// var seleniumWebdriver = require('selenium-webdriver');

module.exports = function () {
  this.Given(/^that I am in the student registration page$/, function () {
    this.driver.get('https://google.com')
  })
}
