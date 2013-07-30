var assert = require('assert');
var Composer = require('../lib/Composer')

describe('composer', function () {
	it("should run accumulated functions", function () {
		var composer = new Composer();
		var result = [];
		composer.add(function (next) { result.push(1); next(); });
		composer.add(function (next) { result.push(2); next(); });
		composer.add(function (next) { result.push(3); next(); });
		composer.run();
		assert.deepEqual(result, [1, 2, 3]);
	});

	it("should auto-run accumulated functions when it's started", function () {
		var composer = new Composer();
		composer.run();
		var result = [];
		composer.add(function (next) { result.push(1); next(); });
		composer.add(function (next) { result.push(2); next(); });
		composer.add(function (next) { result.push(3); next(); });
		assert.deepEqual(result, [1, 2, 3]);
	});

	it("should not auto-run accumulated functions if the previous one hasn't finished", function () {
		var composer = new Composer();
		composer.run();
		var result = [];
		composer.add(function (next) { result.push(1); });
		composer.add(function (next) { result.push(2); });
		composer.add(function (next) { result.push(3); });
		assert.deepEqual(result, [1]);
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