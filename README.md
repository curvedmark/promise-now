# promise-now

Barebone [Promise/A+](http://promisesaplus.com/) implementation.

## Features

- Extremely small (~ 1kb minified), [extremely fast](http://jsperf.com/wqfwewefewrw/17)

- `.then()` being asynchronous is optional.

- Passing the [Promises/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests)

## Installation

	npm install promise-now

## Example

```javascript
var Promise = require('promise-now');
var promise = new Promise();

promise.then(addOne).then(addOne).then(function(num) {
	console.log(num); // 3
});
promise.fulfill(1);

function addOne(num) {
	return num + 1;
}
```

## API

```javascript
promise.then(fulfullCallack, rejectCallback);
```

See the [Q tutorial](https://github.com/kriskowal/q#tutorial), if you are not familiar with promises.

```javascript
promise.fulfill(value, [context]);
```

Fullfil `promise` with `value`. `this` keywords equals to `context` in callbacks if provided. Returns `promise`.

```javascript
promise.reject(reason, [context]);
```

Reject `promise` with `reason`. `this` keywords equals to `context` in callbacks if provided.Returns `promise`.

## `.then()` being asynchonous

If you can be sure that you will never write code like:

```javascript
var promise = new Promise().fulfill();

promise.then(function() {
	console.log(2);
});
console.log(1);
```

In other words, you will not put synchronous code after asynchronous function calls, then it doesn't make a difference if `.then()` is asynchronous or not.

By default, promise-now use synchronous `.then()`. If you need the asynchronous version, simply patch promise-now (see `test/promise.js` on how it's done).