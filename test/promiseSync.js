var assert = require('assert');
var Promise = require('../Promise');

describe('synchronous promise', function () {
	it('should accept asynchronous promise', function (done) {
		var result = [];
		var promise = new Promise().fulfill();
		promise.then(function () {
			var p = new Promise;
			setTimeout(function () {
				result.push(1);
				p.fulfill();
			}, 0);
			return p;
		}).then(function () {
			result.push(2);
			assert.deepEqual(result, [1, 2]);
		}).then(done, done);
	});

	it('should allow context to be set', function (done) {
		var promise = new Promise().fulfill({}, 1);
		promise.then(function () {
			assert.equal(this, 1)
		}).then(done, done);
	});

	it('should allow context to be set on child promise', function (done) {
		var promise = new Promise().fulfill({}, 1);
		promise.then().then(function () {
			assert.equal(this, 1);
		}).then(done, done);
	});
});