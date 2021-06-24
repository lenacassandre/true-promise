import { TruePromise } from "./classes/TruePromise";

export { TruePromise };
export default TruePromise;

/*
console.clear();
console.log("")
console.log("✨ true-promises tests ✨")
console.log("")
console.log("")
*/

///////////////////////////////////////////////////
// SIMPLE TEST
/*
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
*/
///////////////////////////////////////////////////
// ASYNC/AWAIT TEST
/*
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
*/