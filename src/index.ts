import { TruePromise, TruePromise as Promise } from "./classes/TruePromise";

export { TruePromise, Promise };
export default TruePromise;

/* TESTS
console.clear();
console.log("")
console.log("✨ true-promises tests ✨")
console.log("")


///////////////////////////////////////////////////
// SIMPLE TEST

function simpleTest(v: number) {
    console.log("");
    console.log("========================================");
    console.log("simple test", v);

    const test = new TruePromise<string, string>((resolve, reject) => {
        console.log("simple test, inside promise", v)

        if(v === 1 ) {
            resolve('resolved')
        }
        else {
            reject('rejected')
        }
    });

    setTimeout(() => {
        test
            .then((value) => {
                console.log("then value :", value)
            })
            .catch((value) => {
                console.log("catch value :", value)
            })
    }, 500);
}

setTimeout(() => {
    simpleTest(1);
}, 0);


setTimeout(() => {
    simpleTest(2);
}, 1000);

///////////////////////////////////////////////////
// ASYNC/AWAIT TEST

setTimeout(() => {
    console.log("");
    console.log("========================================");
    console.log("Async/await tests");

    async function asyncAwaitTest(v: number) {
        console.log("");
        console.log("========================================");
        console.log("testFunction", v)

        try {
            const value = await new TruePromise<string, string>((resolve, reject) => {
                console.log("inside promise")

                if(v === 1) {
                    setTimeout(() => resolve("resolved"), 500);
                }
                else {
                    setTimeout(() => reject("rejected"), 500);
                }
            })

            console.log("value after await :", value)
        }
        catch(e) {
            console.log("catch value :", e)
        }
    }

    setTimeout(() => {
        asyncAwaitTest(1);
    }, 0);


    setTimeout(() => {
        asyncAwaitTest(2);
    }, 1000);
}, 2000);

//////////////////////////////////////////////////////////////////:
// ALL() test

setTimeout(() => {
    console.log("")
    console.log("========================================");
    console.log("All()")

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
}, 4000);

//////////////////////////////////////////////////////////////////:
// ALLSETTLED() test

setTimeout(() => {
    console.log("")
    console.log("========================================");
    console.log("AllSettled()")

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
}, 6000);

//////////////////////////////////////////////////////////////////:
// ANY() test

setTimeout(() => {
    console.log("")
    console.log("========================================");
    console.log("Any()")

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
}, 8000);

//////////////////////////////////////////////////////////////////:
// RACE() test

setTimeout(() => {
    console.log("")
    console.log("========================================");
    console.log("Race()")

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
}, 10000);

/////////////////////////////////////////////////////////////////////////
// REJECT TEST

setTimeout(() => {
    console.log("")
    console.log("========================================");
    console.log("Reject()")

    // Example immedialty resolving
    TruePromise.reject("string")
        .then((value) => console.log('then', value)) // Never called in this case.
        .catch((value) => console.log('catch', value)); // Immediatly log `string`.

}, 12000);

/////////////////////////////////////////////////////////////////////////
// RESOLVE TEST

setTimeout(() => {
    console.log("")
    console.log("========================================");
    console.log("Resolve()")

    // Example immedialty resolving
    TruePromise.resolve("string")
        .then((value) => console.log('then', value)) // Immediatly log `string`.
        .catch((value) => console.log('catch', value)); // Never called in this case.

}, 12500);


/////////////////////////////////////////////////////////////////////////
// TIMEOUT TEST

setTimeout(() => {
    console.log("")
    console.log("========================================");
    console.log("Timeout()")

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

}, 13500);
*/