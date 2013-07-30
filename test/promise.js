var Promise = require('../lib/Promise');

var runAllComposers = Promise.prototype.runAllComposers;
Promise.prototype.runAllComposers = function() {
	var self = this;
	var args = arguments;
	setImmediate(function () {
		runAllComposers.apply(self, args);
	});
};

exports.pending = function () {
	var promise = new Promise();
	return {
		promise: promise,
		fulfill: function (value) {
			return promise.fulfill(value);
		},
		reject: function (reason) {
			return promise.reject(reason);
		}
	};
};

exports.fulfilled = function (value) {
	return new Promise().fulfill(value);
};

exports.rejected = function (reason) {
	return new Promise().reject(reason);
};