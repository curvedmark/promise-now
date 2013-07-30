var slice = [].slice;

module.exports = Composer;

function Composer() {
	this.fns = [];
	this.running = false;
}

Composer.prototype.add = function (fn) {
	this.fns.push(fn);
	if (this.running) this.runOne();
};

Composer.prototype.run = function () {
	this.running = true;
	this.args = slice.call(arguments, 0);
	this.runOne();
};

Composer.prototype.runOne = function () {
	if (!this.fns.length) return;
	var fn = this.fns.shift();
	var self = this;
	this.args.push(function () {
		self.args = slice.call(arguments, 0);
		self.runOne()
	});
	fn.apply(undefined, this.args);
};