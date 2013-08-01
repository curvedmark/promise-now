var Composer = require('compo');

module.exports = Promise;

var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise() {
	this.state = PENDING;
	this.composers = [];
}

Promise.prototype.then = function(cb, eb) {
	var composer = new Composer();
	composer.add(mergeCallbacks(cb, eb));

	if (this.state) this.runComposer(composer);
	else this.composers.push(composer);

	return {
		then: function (cb, eb) {
			composer.add(mergeCallbacks(cb, eb));
			return this;
		}
	};
};

Promise.prototype.fulfill = function (value) {
	if (this.state) return this;
	this.state = FULFILLED;
	this.arg = value;
	this.runAllComposers();
	return this;
};

Promise.prototype.reject = function (reason) {
	if (this.state) return this;
	this.state = REJECTED;
	this.arg = reason;
	this.runAllComposers();
	return this;
};

Promise.prototype.runComposer = function (composer) {
	composer.run(this.state, this.arg);
};

Promise.prototype.runAllComposers = function () {
	for (var i = 0, len = this.composers.length; i < len; ++i) {
		this.composers[i].run(this.state, this.arg);
	}
	this.composers = null;
};

function isPromise(obj) {
	return obj && typeof obj.then === 'function';
}

function mergeCallbacks(cb, eb) {
	return function (state, arg, next) {
		var fn;
		if (state === FULFILLED && typeof (fn = cb) === 'function'
			|| state === REJECTED && typeof (fn = eb) === 'function'
		) {
			try {
				arg = fn(arg);
			} catch (err) {
				arg = err;
				state = REJECTED;
				return next(state, arg);
			}

			if (isPromise(arg)) {
				return arg.then(function (value) {
					next(FULFILLED, value);
				}, function (reason) {
					next(REJECTED, reason);
				});
			}

			state = FULFILLED;
		}
		next(state, arg);
	};
}