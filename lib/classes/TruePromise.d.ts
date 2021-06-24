export declare class TruePromise<ResolveValue = void, RejectValue = void> {
    private _state;
    private resolveValue?;
    private rejectValue?;
    private resolveCallback?;
    private rejectCallback?;
    constructor(executor: (resolve: (value: ResolveValue) => void, reject: (value: RejectValue) => void) => void);
    get state(): "pending" | "resolved" | "rejected" | "finished";
    _resolve: (value: ResolveValue) => void;
    _reject: (value: RejectValue) => void;
    catch: (onReject: (value: RejectValue) => void) => this;
    finally: (onResolveOrReject: (value: ResolveValue | RejectValue) => void) => this;
    then: (onResolve: (value: ResolveValue) => void, onReject?: ((value: RejectValue) => void) | undefined) => this;
    static all: <ResolveValue_1 = any, RejectValue_1 = undefined>(promises: (TruePromise<ResolveValue_1, RejectValue_1> | Promise<ResolveValue_1>)[]) => TruePromise<ResolveValue_1[], {
        value: RejectValue_1;
        index: number;
    }>;
    static allSettled: <ResolveValue_1 = void, RejectValue_1 = void>(promises: (TruePromise<ResolveValue_1, RejectValue_1> | Promise<ResolveValue_1>)[]) => TruePromise<{
        value: ResolveValue_1 | RejectValue_1;
        status: "resolved" | "rejected";
    }[], void>;
    static any: <ResolveValue_1 = undefined, RejectValue_1 = any>(promises: (TruePromise<ResolveValue_1, RejectValue_1> | Promise<ResolveValue_1>)[]) => TruePromise<{
        value: ResolveValue_1;
        index: number;
    }, RejectValue_1[]>;
    static race: <ResolveValue_1 = void, RejectValue_1 = void>(promises: (TruePromise<ResolveValue_1, RejectValue_1> | Promise<ResolveValue_1>)[]) => TruePromise<{
        value: ResolveValue_1;
        index: number;
    }, {
        value: RejectValue_1;
        index: number;
    }>;
    static reject: <RejectValue_1 = void>(rejectValue: RejectValue_1) => TruePromise<void, RejectValue_1>;
    static resolve: <ResolveValue_1 = void>(resolveValue: ResolveValue_1) => TruePromise<ResolveValue_1, void>;
    static timeout: <ResolveValue_1 = void, RejectValue_1 = void>(promise: TruePromise<ResolveValue_1, RejectValue_1> | Promise<ResolveValue_1>, timeout: number) => TruePromise<ResolveValue_1, RejectValue_1 | "timeout">;
}
//# sourceMappingURL=TruePromise.d.ts.map