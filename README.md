# true-promises
Typescript promises overhaul

⚠️ TruePromise works with async/await syntax in a nodeJS environnement. Not tested in a commonJS environnement.
Its main purpose is to avoid errors, allow async calling of then/catch, and correctly type the value in case of reject.
Native static methods have been reworked with better types.
New timeout() static method.
Feel free to suggest improvements, such as static methods or mechanics.