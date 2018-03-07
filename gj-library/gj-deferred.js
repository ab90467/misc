var Deferred = function() {

    var callbacks = [];
    var failCallbacks = [];
    var done = function(callback) {
        if (typeof callback === 'function') {
            callbacks.push(callback);
        }
        return this;
    };
    var fail = function(callback) {
        if (typeof callback === 'function') {
            failCallbacks.push(callback);
        }
        return this;
    };
    var resolve = function(arg) {

        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i](arg);
        }
    };
    var reject = function(arg) {

        for (var i = 0; i < failCallbacks.length; i++) {
            failCallbacks[i](arg);
        }

    };
    return {
        done: done,
        fail: fail,
        resolve: resolve,
        reject: reject
    };
};
