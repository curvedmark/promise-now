var Composer = require('compo');

module.exports = Promise;

function Promise() {
	this.state = 'pending';
	this.composers = [];
}

Promise.prototype.then = function(cb, eb) {
	var composer = new Composer();
	composer.add(mergeCallbacks(cb, eb));
	this.composers.push(composer);

	if (this.state !== 'pending') this.runAllComposers();

	return {
		then: function (cb, eb) {
			composer.add(mergeCallbacks(cb, eb));
			return this;
		}
	};
};

Promise.prototype.fulfill = function (value) {
	if (this.state !== 'pending') return this;
	this.state = 'fulfilled';
	this.arg = value;
	this.runAllComposers();
	return this;
};

Promise.prototype.reject = function (reason) {
	if (this.state !== 'pending') return this;
	this.state = 'rejected';
	this.arg = reason;
	this.runAllComposers();
	return this;
};

Promise.prototype.runAllComposers = function () {
	while (this.composers.length) {
		var composer = this.composers.shift();
		composer.run(this.state, this.arg);
	}
};

function isPromise(obj) {
	return obj && typeof obj.then === 'function';
}

function mergeCallbacks(cb, eb) {
	return function (state, arg, next) {
		var fn;
		if (state === 'fulfilled' && typeof (fn = cb) === 'function'
			|| state === 'rejected' && typeof (fn = eb) === 'function'
		) {
			try {
				arg = fn(arg);
			} catch (err) {
				arg = err;
				state = 'rejected';
				return next(state, arg);
			}

			if (isPromise(arg)) {
				return arg.then(function (value) {
					next('fulfilled', value);
				}, function (reason) {
					next('rejected', reason);
				});
			}

			state = 'fulfilled';
		}
		next(state, arg);
	};
}