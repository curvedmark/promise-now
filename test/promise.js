var Promise = require('../Promise');

var runComposer = Promise.prototype.runComposer;
Promise.prototype.runComposer = function() {
	var self = this;
	var args = arguments;
	setImmediate(function () {
		runComposer.apply(self, args);
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