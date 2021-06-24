"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruePromise = void 0;
class TruePromise {
    constructor(executor) {
        this._resolve = (value) => {
            if (this._state === "pending") {
                this._state = "resolved";
                this.resolveValue = value;
                if (this.resolveCallback) {
                    this.resolveCallback(this.resolveValue);
                    this._state = "finished";
                }
            }
        };
        this._reject = (value) => {
            if (this._state === "pending") {
                this._state = "rejected";
                this.rejectValue = value;
                if (this.rejectCallback) {
                    this.rejectCallback(this.rejectValue);
                    this._state = "finished";
                }
            }
        };
        this.catch = (onReject) => {
            this.rejectCallback = onReject;
            if (this._state === "rejected") {
                this.rejectCallback(this.rejectValue);
                this._state = "finished";
            }
            return this;
        };
        this.finally = (onResolveOrReject) => {
            return this.then(onResolveOrReject).catch(onResolveOrReject);
        };
        this.then = (onResolve, onReject) => {
            this.resolveCallback = onResolve;
            if (this._state === "resolved") {
                this.resolveCallback(this.resolveValue);
                this._state = "finished";
            }
            if (onReject) {
                return this.catch(onReject);
            }
            return this;
        };
        this._state = "pending";
        executor(this._resolve, this._reject);
        return this;
    }
    get state() {
        return this._state;
    }
}
exports.TruePromise = TruePromise;
TruePromise.all = (promises) => {
    return new TruePromise((resolve, reject) => {
        if (promises.length === 0)
            return resolve([]);
        const resolveValues = [];
        let resolvedPromisesAmount = 0;
        let state = "pending";
        const addResolveValue = (value, index) => {
            resolveValues[index] = value;
            resolvedPromisesAmount++;
            if (resolvedPromisesAmount === promises.length && state === "pending") {
                state = "finished";
                resolve(resolveValues);
            }
        };
        const rejectMainPromise = (value, index) => {
            if (state === "pending") {
                state = "finished";
                reject({ value, index });
            }
        };
        promises.forEach((promise, index) => {
            promise
                .then((value) => addResolveValue(value, index))
                .catch((value) => rejectMainPromise(value, index));
        });
    });
};
TruePromise.allSettled = (promises) => {
    return new TruePromise((resolve, reject) => {
        if (promises.length === 0)
            return resolve([]);
        const values = [];
        let resolvedPromisesAmount = 0;
        let state = "pending";
        const addResolveValue = (value, promiseState, index) => {
            values[index] = { value, status: promiseState };
            resolvedPromisesAmount++;
            if (resolvedPromisesAmount === promises.length && state === "pending") {
                state = "finished";
                resolve(values);
            }
        };
        promises.forEach((promise, index) => {
            promise
                .then((value) => addResolveValue(value, "resolved", index))
                .catch((value) => addResolveValue(value, "rejected", index));
        });
    });
};
TruePromise.any = (promises) => {
    return new TruePromise((resolve, reject) => {
        if (promises.length === 0)
            return reject([]);
        const rejectedValues = [];
        let rejectedPromisesAmount = 0;
        let state = "pending";
        const addRejectedValue = (value, index) => {
            rejectedValues[index] = value;
            rejectedPromisesAmount++;
            if (rejectedPromisesAmount === promises.length && state === "pending") {
                state = "finished";
                reject(rejectedValues);
            }
        };
        const resolveMainPromise = (value, index) => {
            if (state === "pending") {
                state = "finished";
                resolve({ value, index });
            }
        };
        promises.forEach((promise, index) => {
            promise
                .then((value) => resolveMainPromise(value, index))
                .catch((value) => addRejectedValue(value, index));
        });
    });
};
TruePromise.race = (promises) => {
    return new TruePromise((resolve, reject) => {
        let state = "pending";
        const resolveMainPromise = (value, index) => {
            if (state === "pending") {
                state = "finished";
                resolve({ value, index });
            }
        };
        const rejectMainPromise = (value, index) => {
            if (state === "pending") {
                state = "finished";
                reject({ value, index });
            }
        };
        promises.forEach((promise, index) => {
            promise
                .then((value) => resolveMainPromise(value, index))
                .catch((value) => rejectMainPromise(value, index));
        });
    });
};
TruePromise.reject = (rejectValue) => {
    return new TruePromise((_resolve, reject) => reject(rejectValue));
};
TruePromise.resolve = (resolveValue) => {
    return new TruePromise((resolve, _reject) => resolve(resolveValue));
};
TruePromise.timeout = (promise, timeout) => {
    return new TruePromise((resolve, reject) => {
        promise
            .then(resolve)
            .catch(reject);
        setTimeout(() => reject("timeout"), timeout);
    });
};
//# sourceMappingURL=TruePromise.js.map