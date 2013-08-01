# Promise Now

Barebone [Promise/A+](http://promisesaplus.com/) implementation. `.then()` being asynchronous is optional.

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
promise.fulfill(value);
```

Fullfil `promise` with `value`. Returns `promise`.

```javascript
promise.reject(reason);
```

Reject `promise` with `reason`. Returns `promise`.

## Optionally being asynchonous

If you can be sure that you will never write code like:

```javascript
var promise = new Promise().fulfill();

promise.then(function() {
	console.log(2);
});
console.log(1);
```

In other words, you will not put synchronous code after asynchronous function calls, it doesn't make a difference if `.then()` is asynchronous or not.

By default, promise-now use synchronous `.then()`. If you need the asynchronous version, simply patch promise-now (see `test/promise.js` on how it's done).