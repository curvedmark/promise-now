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

Promise.prototype.fulfill = function (value, context) {
	if (this.state) return this;
	this.state = FULFILLED;
	this.arg = value;
	this.context = context;
	this.runAllCallbacks();
	return this;
};

Promise.prototype.reject = function (reason, context) {
	if (this.state) return this;
	this.state = REJECTED;
	this.arg = reason;
	this.context = context;
	this.runAllCallbacks();
	return this;
};

Promise.prototype.runCallback = function (callback) {
	callback(this.state, this.arg, this.context);
};

Promise.prototype.runAllCallbacks = function () {
	for (var i = 0, len = this.callbacks.length; i < len; ++i) {
		this.callbacks[i](this.state, this.arg, this.context);
	}
	this.callbacks = null;
};

function isPromise(obj) {
	return obj && typeof obj.then === 'function';
}

function makeCallback(cb, eb, promise) {
	return function (state, arg, context) {
		var fn;
		if (state === FULFILLED) {
			if (typeof cb !== 'function') return promise.fulfill(arg, context);
			fn = cb;
		} else {
			if (typeof eb !== 'function') return promise.reject(arg, context);
			fn = eb;
		}

		try {
			arg = fn.call(context, arg);
		} catch (err) {
			return promise.reject(err, context);
		}

		if (!isPromise(arg)) return promise.fulfill(arg, context);

		arg.then(function (value) {
			promise.fulfill(value, context);
		}, function (reason) {
			promise.reject(reason, context);
		});
	};
}