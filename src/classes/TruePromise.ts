/**
 *
 * TruePromise is a an overhaul of the javascript class Promise. [Learn how to use Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 *
 *
 * TruePromise is meant to be used with TypeScript.
 *
 * _TruePromise works with async/await syntax in a nodeJS environnement. ⚠️ Not tested in a commonJS environnement._
 *
 * - Do not throw error if not handled.
 * - Allow delayed calling of then/catch.
 * - Correctly type the value in reject cases.
 * - Rework of the static methods with better types.
 * - New timeout() static method.
 *
 * The main purpose of a Promise is to handle a script that can be accepted (resolved), or refused (rejected). For each case, it case send a value.
 * TruePromise is used the same way as javascript Promise. Some returned value may change in static methods.
 * All methods offer documentation while hovering them in your IDE. Most of them are taken from [Mozilla's Promise documentation](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 */
export class TruePromise<ResolveValue = void, RejectValue = void> {
	// "pending": waiting for resolve or reject. "resolved" resolve was called. "rejected" was called. "finished" thenFunction or catchFunction was called.
	private _state: "pending" | "resolved" | "rejected" | "finished";
	private resolveValue?: ResolveValue;
	private rejectValue?: RejectValue;

	private resolveCallback?: (value: ResolveValue) => void;
	private rejectCallback?: (value: RejectValue) => void;



	//////////////////////////////////////////////////////////////////////////////////////////////
    // CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////

	constructor(
		executor: (
			resolve: (value: ResolveValue) => void,
			reject: (value: RejectValue) => void,
		) => void
	) {
        // Declare the promise as "pending".
		this._state = "pending";

        // Call the executor function
		executor(this._resolve, this._reject);

        // Return this to chain
		return this
	}

	get state() {
		return this._state
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PRIVATE METHODS /////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Method given to the executor
	 * @param value
	 * @see constructor
	 */
    public _resolve = (value: ResolveValue) => {
        if(this._state === "pending") {
            this._state = "resolved";
            this.resolveValue = value;

            if(this.resolveCallback) {
                this.resolveCallback(this.resolveValue);
                this._state = "finished";
            }
        }
    }

	/**
	 * Method given to the executor
	 * @param value
	 * @see constructor
	 */
    public _reject = (value: RejectValue) => {
        if(this._state === "pending") {
            this._state = "rejected";
            this.rejectValue = value;

            if(this.rejectCallback) {
                this.rejectCallback(this.rejectValue);
                this._state = "finished";
            }
        }
    }



	///////////////////////////////////////////////////////////////////////////////////////////////////
    // PUBLIC METHODS /////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * The catch() method returns a the promise and deals with rejected cases only.
	 *
	 * @param onReject Function called when the promise is rejected.
	 * @returns the promise itself.
	 */
	public catch = (onReject: (value: RejectValue) => void) => {
		this.rejectCallback = onReject;

		// If the promise was already rejected when catch() is called, rejectCallback is called and the promise is declared finished
		if(this._state === "rejected") {
			this.rejectCallback(<RejectValue>this.rejectValue);
			this._state = "finished";
		}

		return this;
	}

	/**
	 * The finally() method returns a Promise. When the promise is settled, i.e either resolved or rejected, the specified callback function is executed. This provides a way for code to be run whether the promise was resolved successfully or rejected once the Promise has been dealt with. This helps to avoid duplicating code in both the promise's then() and catch() handlers.
	 *
	 * @param onResolveOrReject function called when the promised is resolved or rejected.
	 * @returns the promise itself.
	 */
	public finally = (onResolveOrReject: (value: ResolveValue| RejectValue) => void) => {
		return this.then(onResolveOrReject).catch(onResolveOrReject);
	}

	/**
	 * The then() method returns a Promise. It takes up to two arguments: callback functions for the success and failure cases of the Promise.
	 *
	 * @param onResolve Function called when the promise is resolved.
	 * @param onReject optional. Function called when the promise is rejected.
	 * @returns the promise itself.
	 */
	 public then = (onResolve: (value: ResolveValue) => void, onReject?: (value: RejectValue) => void) => {
		this.resolveCallback = onResolve;

		// If the promise was already resolved when then() is called, resolveCallback is called and the promise is declared finished
		if(this._state === "resolved") {
			this.resolveCallback(<ResolveValue>this.resolveValue);
			this._state = "finished";
		}

		// Is a second callback is given, this.catch() is called
		if(onReject) {
			return this.catch(onReject);
		}

		return this;
	}


	////////////////////////////////////////////////////////////////////////////////////////////////////
    // STATIC METHODS //////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * The Promise.all() method takes an iterable of promises as an input, and returns a single Promise that resolves to an array of the results of the input promises, in the same order. This returned promise will resolve when all of the input's promises have resolved, or if the input iterable contains no promises. It rejects immediately upon any of the input promises rejecting, and will reject with this first value as {value, index: index of the rejected promise}.
	 * @param promises Array of promises.
	 * @returns a new TruePromise.
	 */
	static all = <ResolveValue = any, RejectValue = undefined>(promises: (TruePromise<ResolveValue, RejectValue> | Promise<ResolveValue>)[]) => {
		return new TruePromise<ResolveValue[], {value: RejectValue, index: number}>((resolve, reject) => {
			if(promises.length === 0) return resolve([]);

			// array containing all resolved values from the promises
			const resolveValues: ResolveValue[] = [];
			// amount of promises that have been resolved
			let resolvedPromisesAmount = 0;
			// all() script state. "Pending" means the promises are still processing. "Finished" means either all promised have been resolved or one have been rejected.
			let state: "pending" | "finished" = "pending";

			/**
			 * Add a resolved value to the resolved values array.
			 */
			const addResolveValue = (value: ResolveValue, index: number) => {
				resolveValues[index] = value;
				resolvedPromisesAmount++;

				// If all promises have been resolved and the script is not finished, the main promise is resolved.
				if(resolvedPromisesAmount === promises.length && state === "pending") {
					state = "finished";
					resolve(resolveValues);
				}
			}

			/**
			 * Reject and finish the promise
			 */
			const rejectMainPromise = (value: RejectValue, index: number) => {
				if(state === "pending") {
					state = "finished";
					reject({value, index})
				}
			}

			// Check all promise
			promises.forEach((promise, index) => {
				promise
					// add the resolved value to the array
					.then((value) => addResolveValue(value, index))
					// reject the whole promise if one promise is rejected
					.catch((value) => rejectMainPromise(value, index))
			})
		})
	}

	/**
	 * The Promise.allSettled() method returns a promise that resolves after all of the given promises have either resolved or rejected, with an array of objects that each describes the outcome of each promise. It is typically used when you have multiple asynchronous tasks that are not dependent on one another to complete successfully, or you'd always like to know the result of each promise. In comparison, the Promise returned by Promise.all() may be more appropriate if the tasks are dependent on each other / if you'd like to immediately reject upon any of them rejecting.
	 * @param promises Array of promises.
	 * @returns a new TruePromise.
	 */
	static allSettled = <ResolveValue = void, RejectValue = void>(promises: (TruePromise<ResolveValue, RejectValue> | Promise<ResolveValue>)[]) => {
		return new TruePromise<{value: ResolveValue | RejectValue, status: "resolved" | "rejected"}[], void>((resolve, reject) => {
			if(promises.length === 0) return resolve([]);

			// array containing all values from the promises
			const values: {value: ResolveValue | RejectValue, status: "resolved" | "rejected"}[] = [];
			// amount of promises that have been resolved
			let resolvedPromisesAmount = 0;
			// allSettled() script state. "Pending" means the promises are still processing. "Finished" means either all promised have been resolved or one have been rejected.
			let state: "pending" | "finished" = "pending";

			/**
			 * Add a resolved value to the resolved values array.
			 */
			const addResolveValue = (value: ResolveValue, promiseState: "resolved" | "rejected", index: number) => {
				values[index] = {value, status: promiseState};
				resolvedPromisesAmount++;

				// If all promises have been resolved and the script is not finished, the main promise is resolved.
				if(resolvedPromisesAmount === promises.length && state === "pending") {
					state = "finished";
					resolve(values);
				}
			}

			// Check all promise
			promises.forEach((promise, index) => {
				promise
					// add the resolved value to the array
					.then((value) => addResolveValue(value, "resolved", index))
					// add the rejected value to the array
					.catch((value) => addResolveValue(value, "rejected", index))
			})
		})
	}

	/**
	 * Promise.any() takes an array of Promises and, as soon as one of the promises in the array fulfills, returns a single promise that resolves with the value from that promise. If no promises in the array fulfill (if all of the given promises are rejected), then the returned promise is rejected with all the rejected values from the promise, in the same order.
	 * @param promises Array of promises.
	 * @returns a new TruePromise.
	 */
	static any = <ResolveValue = undefined, RejectValue = any>(promises: (TruePromise<ResolveValue, RejectValue> | Promise<ResolveValue>)[]) => {
		return new TruePromise<{value: ResolveValue, index: number}, RejectValue[]>((resolve, reject) => {
			if(promises.length === 0) return reject([]);

			// array containing all resolved values from the promises
			const rejectedValues: RejectValue[] = [];
			// amount of promises that have been resolved
			let rejectedPromisesAmount = 0;
			// any() script state. "Pending" means the promises are still processing. "Finished" means either all promised have been resolved or one have been rejected.
			let state: "pending" | "finished" = "pending";

			/**
			 * Add a rejected value to the rejected values array.
			 */
			const addRejectedValue = (value: RejectValue, index: number) => {
				rejectedValues[index] = value;
				rejectedPromisesAmount++;

				// If all promises have been rejected and the script is not finished, the main promise is rejected.
				if(rejectedPromisesAmount === promises.length && state === "pending") {
					state = "finished";
					reject(rejectedValues);
				}
			}

			/**
			 * Resolve and finish the promise
			 */
			const resolveMainPromise = (value: ResolveValue, index: number) => {
				if(state === "pending") {
					state = "finished";
					resolve({value, index})
				}
			}

			// Check all promise
			promises.forEach((promise, index) => {
				promise
					// add the resolved value to the array
					.then((value) => resolveMainPromise(value, index))
					// reject the whole promise if one promise is rejected
					.catch((value) => addRejectedValue(value, index))
			})
		})
	}

	/**
	 * The Promise.race() method returns a promise that fulfills or rejects as soon as one of the promises in an iterable fulfills or rejects, with the value from that promise and index of it.
	 * @param promises Array of promises.
	 * @returns a new TruePromise.
	 */
	static race = <ResolveValue = void, RejectValue = void>(promises: (TruePromise<ResolveValue, RejectValue> | Promise<ResolveValue>)[]) => {
		return new TruePromise<{value: ResolveValue, index: number}, {value: RejectValue, index: number}>((resolve, reject) => {
			// race() script state. "Pending" means the promises are still processing. "Finished" means either all promised have been resolved or one have been rejected.
			let state: "pending" | "finished" = "pending";

			/**
			 * Resolve and finish the promise
			 */
			const resolveMainPromise = (value: ResolveValue, index: number) => {
				if(state === "pending") {
					state = "finished";
					resolve({value, index})
				}
			}

			/**
			 * Reject and finish the promise
			 */
			 const rejectMainPromise = (value: RejectValue, index: number) => {
				if(state === "pending") {
					state = "finished";
					reject({value, index})
				}
			}

			// Check all promise
			promises.forEach((promise, index) => {
				promise
					// add the resolved value to the array
					.then((value) => resolveMainPromise(value, index))
					// reject the whole promise if one promise is rejected
					.catch((value) => rejectMainPromise(value, index))
			})
		})
	}

	/**
	 * The Promise.reject() method returns a Promise object that is rejected with a given value.
	 * @param promises Array of promises.
	 * @returns a new TruePromise that immediatly reject.
	 */
	static reject = <RejectValue = void>(rejectValue: RejectValue) => {
		return new TruePromise<void, RejectValue>((_resolve, reject) => reject(rejectValue));
	}

	/**
	 * The Promise.resolve() method returns a Promise object that is resolved with a given value.
	 * @param promises Array of promises.
	 * @returns a new TruePromise that immediatly resolve.
	 */
	static resolve = <ResolveValue = void>(resolveValue: ResolveValue) => {
		return new TruePromise<ResolveValue, void>((resolve, _reject) => resolve(resolveValue));
	}

	/**
	 * The Promise.timeout() method returns a Promise object that resolves when the given promise is resolved, and rejects when the given promise is rejected or when the given timeout is up.
	 * @param promises Array of promises.
	 * @returns a new TruePromise that immediatly resolve.
	 */
	 static timeout = <ResolveValue = void, RejectValue = void>(
		executor: (
			resolve: (value: ResolveValue) => void,
			reject: (value: RejectValue) => void
		) => void,
		timeout: number) => {
		return new TruePromise<ResolveValue, RejectValue | "timeout">((resolve, reject) => {
			new TruePromise<ResolveValue, RejectValue>(executor)
				.then(resolve)
				.catch(reject);

			setTimeout(() => reject("timeout"), timeout);
		});
	}
}