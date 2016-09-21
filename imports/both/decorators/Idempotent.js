"use strict";
function Idempotent(target, key, descriptor) {
    var getter = descriptor.get;
    var previous = new Map();
    function idempotentVersion() {
        var result = getter.call(this);
        var identifier = key + ":" + this._id;
        var latestJson = JSON.stringify(result);
        var cachedJson = '';
        if (previous.has(identifier)) {
            cachedJson = JSON.stringify(previous.get(identifier));
        }
        if (latestJson === cachedJson) {
            result = previous.get(identifier);
        }
        previous.set(identifier, result);
        return result;
    }
    descriptor.get = idempotentVersion;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Idempotent;
