var assert = require('assert');
var Composer = require('../lib/Composer')

describe('slinky', function () {
	it("should run accumulated callbacks", function () {
		var composer = new Composer();
		var result = [];
		composer.add(function (next) { result.push(1); next(); });
		composer.add(function (next) { result.push(2); next(); });
		composer.add(function (next) { result.push(3); next(); });
		composer.run();
		assert.deepEqual(result, [1, 2, 3]);
	});

	it("should auto-run accumulated callbacks when it's running", function () {
		var composer = new Composer();
		composer.run();
		var result = [];
		composer.add(function (next) { result.push(1); next(); });
		composer.add(function (next) { result.push(2); next(); });
		composer.add(function (next) { result.push(3); next(); });
		assert.deepEqual(result, [1, 2, 3]);
	});

	it("should pass returned values", function (done) {
		var composer = new Composer();
		var addOne = function (num, next) { next(num + 1); }
		composer.add(addOne);
		composer.add(addOne);
		composer.add(function (num, next) {
			assert.equal(num, 3);
			done();
		});
		composer.run(1);
	});
});