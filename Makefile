promise-now.js: Promise.js | node_modules
	@echo '(function () {' >$@
	@sed -E 's/^module\.exports = .+;//' Promise.js >>$@
	@echo 'window.Promise = Promise;' >>$@
	@echo '})();' >>$@
	@uglifyjs $@ -cm --output $@

node_modules:
	@npm install