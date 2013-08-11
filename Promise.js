var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

module.exports = Promise;

function Promise() {
	this.state = PENDING;
	this.callbacks = [];
}

Promise.prototype.then = function(cb, eb) {
	var promise = new Promise();
	var callback = this.createCallback(cb, eb, promise);

	if (this.state) this.runCallback(callback);
	else this.callbacks.push(callback);

	return promise;
};

Promise.prototype.fulfill = function (value, context) {
	return this.resolve(FULFILLED, value, context);
};

Promise.prototype.reject = function (reason, context) {
	return this.resolve(REJECTED, reason, context);
};

Promise.prototype.resolve = function (state, arg, context) {
	if (this.state) return this;

	this.state = state;
	this.arg = arg;
	this.context = context;

	for (var i = 0, len = this.callbacks.length; i < len; ++i) {
		this.callbacks[i]();
	}
	this.callbacks = null;

	return this;
};

Promise.prototype.runCallback = function (callback) {
	callback();
};

Promise.prototype.createCallback = function (cb, eb, promise) {
	var self = this;

	return function () {
		var state = self.state;
		var arg = self.arg;
		var context = self.context;
		var fn;

		if (state === FULFILLED && typeof (fn = cb) === 'function'
			|| state === REJECTED && typeof (fn = eb) === 'function'
		) {
			try {
				arg = fn.call(context, arg);
			} catch (err) {
				return promise.reject(err, context);
			}

			// returned a promise
			if (arg && typeof arg.then === 'function') {
				return arg.then(function (value) {
					promise.fulfill(value, context);
				}, function (reason) {
					promise.reject(reason, context);
				});
			}

			state = FULFILLED;
		}

		promise.resolve(state, arg, context);
	};
};