var push = [].push;

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
	this.args = arguments;
	this.runOne();
};

Composer.prototype.runOne = function () {
	if (this.pending || !this.fns.length) return;
	var fn = this.fns.shift();
	var self = this;
	push.call(this.args, function () {
		self.pending = false;
		self.args = arguments;
		self.runOne()
	});
	this.pending = true;
	fn.apply(undefined, this.args);
};