"use strict";
var mongo_1 = require('meteor/mongo');
function SetupCollection(name) {
    return function setupCollection(target) {
        target.collection = new mongo_1.Mongo.Collection(name, {
            transform: function (doc) {
                return new target(doc);
            }
        });
    };
}
