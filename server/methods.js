import { Meteor } from 'meteor/meteor'

const fs = Npm.require('fs')


Meteor.methods({
  writeFileSync(path, data) {
    fs.writeFileSync(path, data, (err) => {
      if (err) {
        console.log(err);
      }
    })
  },
})
