interface PromiseFulfilledResult<T> {
    status: "fulfilled";
    value: T;
}

interface PromiseRejectedResult {
    status: "rejected";
    reason: any;
}

type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

type Resolvable<R> = R | PromiseLike<R>
type IterateFunction<T, R> = (item: T, index: number | string) => Resolvable<R>;
