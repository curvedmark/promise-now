var slice = [].slice;

module.exports = Composer;

function Composer() {
	this.fns = [];
	this.started = false;
}

Composer.prototype.add = function (fn) {
	this.fns.push(fn);
	if (this.started) this.runOne();
};

Composer.prototype.run = function () {
	this.started = true;
	this.args = slice.call(arguments, 0);
	this.runOne();
};

Composer.prototype.runOne = function () {
	if (this.pending || !this.fns.length) return;
	var fn = this.fns.shift();
	var self = this;
	this.args.push(function () {
		self.pending = false;
		self.args = slice.call(arguments, 0);
		self.runOne()
	});
	this.pending = true;
	fn.apply(undefined, this.args);
};