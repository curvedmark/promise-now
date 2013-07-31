promise-now.js: Promise.js | node_modules
	@echo '(function () {' >$@
	@sed -E \
		-e 's/^module\.exports = .+;//' \
		-e 's/^var .+ = require\('.+'\);//' \
		Promise.js node_modules/compo/Composer.js >>$@
	@echo 'window.Promise = Promise;' >>$@
	@echo '})();' >>$@
	@uglifyjs $@ -cm --output $@

node_modules:
	@npm install