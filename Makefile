all: subtree promise-now.js

subtree:
	@git merge --quiet -X subtree=master master

promise-now.js: master/lib/Promise.js node_modules/.bin/uglifyjs
	@echo '(function () {' >$@
	@sed -E 's/^module\.exports = .+;//' $< >>$@
	@echo 'window.Promise = Promise;' >>$@
	@echo '})();' >>$@
	@node_modules/.bin/uglifyjs $@ -cm --output $@

node_modules:
	@npm install

.PHONY: all subtree