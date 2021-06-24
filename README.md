# true-promise

TruePromise is a an overhaul of the javascript class Promise. [Learn how to use Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).



# Introduction

TruePromise is meant to be used with TypeScript.

_TruePromise works with async/await syntax in a nodeJS environnement. ⚠️ Not tested in a commonJS environnement._

- Do not throw error if not handled.
- Allow delayed calling of then/catch.
- Correctly type the value in reject cases.
- Rework of the static methods with better types.
- New timeout() static method.

**Feel free to suggest any improvement.**



# Installation

###### NPM
```npm install --save true-promise```

###### Yarn
```yarn add true-promise```

# Importing

You can name it as you want. For example, let's replace javascript Promise class.
```ts
import Promise from 'true-promise';
```

or


```ts
import { TruePromise } from 'true-promise';
```

For clarity sake, following examples will use `TruePromise` spelling when refering to this library's _Promise_ class, but you can use `Promise` as well.



# Usage

The main purpose of a Promise is to handle a script that can be accepted (resolved), or refused (rejected). For each case, it case send a value.
TruePromise is used the same way as javascript Promise. Some returned value may change in static methods.
All methods offer documentation while hovering them in your IDE. Most of them are taken from [Mozilla's Promise documentation](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise).

## New TruePromise

The difference with javascript Promise is that you can type the value that is supposed to come when rejecting the promise. This is meant to use a different rejection way than throwing an error.

```ts
import TruePromise from 'true-promise';

// Here, the promise must resolve with a string, or reject with a number.
new TruePromise<string, number>((resolve, reject) => {
    resolve("true promise"); // Works
    resolve(1); // Error
    reject("true promise"); // Error
    reject(1); // Works
});
```

## Handling a TruePromise future

Unlike javascript Promise, you don't have to call then and catch. You can also call them later.

```ts
import TruePromise from 'true-promise';

const promise = new TruePromise<string, number>((resolve, reject) => {
  reject(1); // The Promise is immediatly rejected
}); // No then() called.

setTimeout(() => {
  promise.then((value) => console.log(value)); // Since the promise has been previously rejected, the reject function is immediatly called. And you now for sure the value is a number.
}, 1000);
```

## Static methods

Statics methods have been rework to implement the rejected value type feature. All static methods taking promises as argument accept javascript Promise and TruePromise.

### TruePromise.all()
The Promise.all() method takes an iterable of promises as an input, and returns a single Promise that resolves to an array of the results of the input promises, in the same order. This returned promise will resolve when all of the input's promises have resolved, or if the input iterable contains no promises. It rejects immediately upon any of the input promises rejecting, and will reject with this first value as {value, index: index of the rejected promise}.

```ts
// Example immediatly resolving
TruePromise.all([])
    .then((values) => console.log('then', values)) // Immediatly log `then []`.
    .catch((values) => console.log('catch', values)); // Never called in this case.

// Example resolving after 500ms
TruePromise.all<string, number>([
    new Promise((resolve, reject) => resolve("string")),
    new TruePromise((resolve, reject) => setTimeout(() => resolve("string"), 500)),
    new TruePromise((resolve, reject) => resolve("string")),
])
    .then((values) => console.log('then', values)) // Log `then ["string", "string", "string"]` after 500ms.
    .catch((rejection) => console.log('catch', rejection)) // Never called in this case.

// Exemple rejecting after 1s
TruePromise.all<string, number>([
    new Promise((resolve, reject) => resolve("string")),
    new TruePromise((resolve, reject) => setTimeout(() => reject(2), 1000)), // Rejecting after 1s.
    new TruePromise((resolve, reject) => resolve("string")),
])
    .then((values) => console.log('then', values)) // Never called in this case.
    .catch((rejection) => console.log('catch', rejection)) // Log `catch {value: 2, index: 1}` after 1s.
```

### TruePromise.allSettled()
The Promise.allSettled() method returns a promise that resolves after all of the given promises have either resolved or rejected, with an array of objects that each describes the outcome of each promise. It is typically used when you have multiple asynchronous tasks that are not dependent on one another to complete successfully, or you'd always like to know the result of each promise. In comparison, the Promise returned by Promise.all() may be more appropriate if the tasks are dependent on each other / if you'd like to immediately reject upon any of them rejecting.

```ts
// Example immediatly resolving
TruePromise.allSettled([])
    .then((values) => console.log('then', values)) // Immediatly log `then []`.
    .catch((values) => console.log('catch', values)); // Never called in any case.

// Example resolving after 500ms
TruePromise.allSettled<string, number>([
    new Promise((resolve, reject) => resolve("string")),
    new TruePromise((resolve, reject) => setTimeout(() => resolve("string"), 500)),
    new TruePromise((resolve, reject) => resolve("string")),
])
    .then((values) => console.log('then', values)) // Log `then [{ value: 'string', status: 'resolved' },{ value: 'string', status: 'resolved' },{ value: 'string', status: 'resolved' }]` after 500ms.
    .catch((rejection) => console.log('catch', rejection)) // Never called in any case.

// Exemple resolving after 1s
TruePromise.allSettled<string, number>([
    new Promise((resolve, reject) => resolve("string")),
    new TruePromise((resolve, reject) => setTimeout(() => reject(2), 1000)), // Rejecting after 1s.
    new TruePromise((resolve, reject) => resolve("string")),
])
    .then((values) => console.log('then', values)) // Log `then [{ value: 'string', status: 'resolved' },{ value: 2, status: 'rejected' },{ value: 'string', status: 'resolved' }]` after 1s.
    .catch((rejection) => console.log('catch', rejection)) // Never called in any case.
```


### TruePromise.any()
Promise.any() takes an array of Promises and, as soon as one of the promises in the array fulfills, returns a single promise that resolves with the value from that promise. If no promises in the array fulfill (if all of the given promises are rejected), then the returned promise is rejected with all the rejected values from the promise, in the same order.

```ts
// Example immediatly rejecting
TruePromise.any([])
    .then((values) => console.log('then', values)) // Never called in this case.
    .catch((values) => console.log('catch', values)); // Immediatly log `catch[]`.

// Example resolving after 500ms
TruePromise.any<string, number>([
    new Promise((resolve, reject) => resolve("string")),
    new TruePromise((resolve, reject) => setTimeout(() => resolve("string"), 500)),
    new TruePromise((resolve, reject) => resolve("string")),
])
    .then((values) => console.log('then', values)) // Log `then { value: 'string', index: 2 }` after 500ms.
    .catch((rejection) => console.log('catch', rejection)) // Never called in this case.

// Exemple resolving after 1s
TruePromise.any<string, number>([
    new Promise((resolve, reject) => resolve("string")),
    new TruePromise((resolve, reject) => setTimeout(() => reject(2), 1000)), // Rejecting after 1s.
    new TruePromise((resolve, reject) => resolve("string")),
])
    .then((values) => console.log('then', values)) // Log `then { value: 'string', index: 2 }` after 1s.
    .catch((rejection) => console.log('catch', rejection)) // Never called in this case.
```

### TruePromise.race()
The Promise.race() method returns a promise that fulfills or rejects as soon as one of the promises in an iterable fulfills or rejects, with the value from that promise and index of it.

```ts
// Example never resolving or rejecting
TruePromise.race([])
    .then((values) => console.log('then', values)) // Never called in this case.
    .catch((values) => console.log('catch', values)); // Never called in this case.

// Example resolving after 500ms
TruePromise.race<string, number>([
    new Promise((resolve, reject) => resolve("string")),
    new TruePromise((resolve, reject) => setTimeout(() => resolve("string"), 500)),
    new TruePromise((resolve, reject) => resolve("string")),
])
    .then((values) => console.log('then', values)) // Log `then { value: 'string', index: 2 }` after 500ms.
    .catch((rejection) => console.log('catch', rejection)) // Never called in this case.

// Exemple resolving after 1s
TruePromise.race<string, number>([
    new Promise((resolve, reject) => resolve("string")),
    new TruePromise((resolve, reject) => setTimeout(() => reject(2), 1000)), // Rejecting after 1s.
    new TruePromise((resolve, reject) => resolve("string")),
])
    .then((values) => console.log('then', values)) //  Log `then { value: 'string', index: 2 }` after 1s.
    .catch((rejection) => console.log('catch', rejection)) // Never called in this case.
```

### TruePromise.reject()
The Promise.reject() method returns a Promise object that is rejected with a given value.

```ts
// Example immedialty resolving
TruePromise.reject("string")
    .then((value) => console.log('then', value)) // Never called in this case.
    .catch((value) => console.log('catch', value)); // Immediatly log `string`.
```

### TruePromise.resolve()
The Promise.resolve() method returns a Promise object that is resolved with a given value.

```ts
// Example immedialty resolving
TruePromise.resolve("string")
    .then((value) => console.log('then', value)) // Immediatly log `string`.
    .catch((value) => console.log('catch', value)); // Never called in this case.
```

### TruePromise.timeout()
The Promise.timeout() method returns a Promise object that resolves when the given promise is resolved, and rejects when the given promise is rejected or when the given timeout is up.

```ts
// Example immedialty resolving
TruePromise.timeout<string, number>((resolve, reject) => {
    resolve("string")
}, 1000)
    .then((value) => console.log('then', value)) // Immediatly log `string`.
    .catch((value) => console.log('catch', value)); // Never called in this case.

        // Example immedialty resolving
TruePromise.timeout<string, number>((resolve, reject) => {
    setTimeout(() => resolve("string"), 2000);
}, 1000)
    .then((value) => console.log('then', value)) // Never called in this case.
    .catch((value) => console.log('catch', value)); // Log "timeout" after 1s.
```
