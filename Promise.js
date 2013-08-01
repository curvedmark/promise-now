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
	var callback = makeCallback(cb, eb, promise);

	if (this.state) this.runCallback(callback);
	else this.callbacks.push(callback);

	return promise;
};

Promise.prototype.fulfill = function (value) {
	if (this.state) return this;
	this.state = FULFILLED;
	this.arg = value;
	this.runAllCallbacks();
	return this;
};

Promise.prototype.reject = function (reason) {
	if (this.state) return this;
	this.state = REJECTED;
	this.arg = reason;
	this.runAllCallbacks();
	return this;
};

Promise.prototype.runCallback = function (callback) {
	callback(this.state, this.arg);
};

Promise.prototype.runAllCallbacks = function () {
	for (var i = 0, len = this.callbacks.length; i < len; ++i) {
		var callback = this.callbacks[i];
		callback(this.state, this.arg);
	}
	this.callbacks = null;
};

function isPromise(obj) {
	return obj && typeof obj.then === 'function';
}

function makeCallback(cb, eb, promise) {
	return function (state, arg) {
		var fn;
		if (state === FULFILLED) {
			if (typeof (fn = cb) !== 'function') return promise.fulfill(arg);
		} else {
			if (typeof (fn = eb) !== 'function') return promise.reject(arg);
		}

		try {
			arg = fn(arg);
		} catch (err) {
			arg = err;
			return promise.reject(arg);
		}

		if (!isPromise(arg)) return promise.fulfill(arg);

		arg.then(function (value) {
			promise.fulfill(value);
		}, function (reason) {
			promise.reject(reason);
		});
	};
}