"use strict";
var underscore_1 = require('underscore');
var Model = (function () {
    function Model(doc) {
        if (this.constructor.name === 'Model') {
            throw new Error('Model is abstract, and should not be instantiated.');
        }
        underscore_1.default(this).extend(doc);
    }
    Model.find = function (selector, options) {
        if (selector === void 0) { selector = {}; }
        if (options === void 0) { options = {}; }
        return this.collection.find(selector, options);
    };
    Model.findOne = function (selector, options) {
        if (selector === void 0) { selector = {}; }
        if (options === void 0) { options = {}; }
        return this.collection.findOne(selector, options);
    };
    Model.insert = function (doc, callback) {
        return this.collection.insert(doc, callback);
    };
    Model.update = function (selector, modifier, options, callback) {
        return this.collection.update(selector, modifier, options, callback);
    };
    Model.remove = function (selector, callback) {
        if (selector === void 0) { selector = {}; }
        return this.collection.remove(selector, callback);
    };
    Object.defineProperty(Model.prototype, "doc", {
        get: function () {
            return underscore_1.default(this).omit('_id');
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype.save = function (callback) {
        if (this._id) {
            return this.constructor.update(this._id, { $set: this.doc }, {}, callback);
        }
        else {
            return this.constructor.insert(this.doc, callback);
        }
    };
    return Model;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Model;
//# sourceMappingURL=Model.js.map