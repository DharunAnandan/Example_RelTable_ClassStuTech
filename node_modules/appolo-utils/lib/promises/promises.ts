import {Deferred} from "./deferred";
import {PromiseMap} from "./promiseMap";
import {PromiseFilter} from "./promiseFilter";
import {PromiseSome} from "./promiseSome";

export class Promises {
    public static delay(delay: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    public static map<R, U>(iterable: Resolvable<Iterable<Resolvable<R>>>, mapper: IterateFunction<R, U>, options: { concurrency: number } = {concurrency: Infinity}): Promise<U[]> {

        return PromiseMap.map(iterable, mapper, options);
    }

    public static props<T>(props: object & { [K in keyof T]: Resolvable<T[K]> }, options: { concurrency: number } = {concurrency: Infinity}): Promise<T> {
        const keys = Object.keys(props);
        const values = Object.values(props);

        return Promises.map(values, (item) => item, {concurrency: options.concurrency})
            .then(resolved => {
                const res: { [K in keyof T]: T[K] } = {} as any;

                for (let i = 0, len = keys.length; i < len; i++) {
                    res[keys[i]] = resolved[i];
                }

                return res
            })
    }

    public static filter<R, U>(iterable: Resolvable<Iterable<Resolvable<R>>>, filterer: IterateFunction<R, U>, options: { concurrency: number } = {concurrency: Infinity}): Promise<U[]> {
        return PromiseFilter.filter(iterable, filterer, options)
    }

    public static fromCallback<T>(resolver: (callback: (err: any, result?: T) => void) => void): Promise<T> {
        return new Promise((resolve, reject) => {
            resolver((err, data) => {
                if (err == null) {
                    resolve(data);
                } else {
                    reject(err);
                }
            })
        })
    }

    public static defer<T>(): Deferred<T> {
        return new Deferred();
    }


    public static to<T, K>(promise: Promise<T>): Promise<[K, T?]> {
        return promise.then(data => [null, data] as [K, T]).catch(e => [e] as [K, T?])
    }

    public static allSettled<T>(promises: Promise<T>[]): Promise<({ status: "fulfilled"; value: T; } | { status: "rejected"; reason: any; })[]> {

        let settled = [];

        for (let i = 0; i < promises.length; i++) {
            let promise = promises[i]
                .then(value => ({status: "fulfilled", value}))
                .catch(reason => ({status: "rejected", reason}));

            settled.push(promise);
        }

        return Promise.all(settled);
    }

    public static some<T>(promises: Promise<T>[], opts: { counter?: number } = {}): Promise<({ status: "fulfilled"; value: T; } | { status: "rejected"; reason: any; })[]> {

        return PromiseSome.some(promises, opts);
    }

    public static someRejected<T>(promises: Promise<T>[], opts: { counter?: number, fn?: (value: T) => boolean } = {}): Promise<({ status: "rejected"; reason: any; })[]> {

        return PromiseSome.someRejected(promises, opts);
    }

    public static someResolved<T>(promises: Promise<T>[], opts: { counter?: number, fn?: (value: T) => boolean } = {}): Promise<({ status: "fulfilled"; value: T; })[]> {

        return PromiseSome.someResolved(promises, opts);
    }

    public static isPromise(obj: any): boolean {

        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function' && typeof obj.catch === 'function';

    }

    public static timeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
        return Promises.promiseTimeout(promise, timeout)
    }

    public static async retry<T>(fn: () => Promise<T>, retires: number = 1): Promise<T> {
        let [err, result] = await Promises.to(fn());

        if (err == null) {
            return result
        }

        if (retires <= 0) {
            throw err;
        }

        return Promises.retry(fn, --retires);
    }

    public static promiseTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let interval = setTimeout(() => reject(new Error("promise timeout")), timeout);
            promise
                .then(resolve)
                .catch(reject)
                .finally(() => clearTimeout(interval))
        })
    }
}





