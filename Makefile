promise-now.js: lib/Composer.js lib/Promise.js | node_modules
	@echo '(function () {' >$@
	@sed -E \
		-e 's/^module\.exports = .+;//' \
		-e 's/^var .+ = require\('.+'\);//' \
		lib/Promise.js lib/Composer.js >>$@
	@echo 'window.Promise = Promise;' >>$@
	@echo '})();' >>$@
	@uglifyjs $@ -cm --output $@

node_modules:
	@npm install