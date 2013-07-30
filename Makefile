promise-now.js: lib/Composer.js lib/Promise.js | node_modules
	browserify --standalone Promise lib/Promise.js | uglifyjs -cm --output $@

node_modules:
	npm install