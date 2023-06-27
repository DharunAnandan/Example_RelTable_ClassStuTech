"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Promises {
    static delay(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    static map(iterable, mapper, options = { concurrency: Infinity }) {
        let concurrency = options.concurrency || Infinity;
        let params = { index: 0 }, results = [], iterator = iterable[Symbol.iterator](), promises = [];
        while (concurrency-- > 0) {
            let promise = Promises._mapWrapper(mapper, iterator, results, params);
            if (!promise) {
                break;
            }
            promises.push(promise);
        }
        return Promise.all(promises).then(() => results);
    }
    static props(props, options = { concurrency: Infinity }) {
        const keys = Object.keys(props);
        const values = Object.values(props);
        return Promises.map(values, (item) => item, { concurrency: options.concurrency })
            .then(resolved => {
            const res = {};
            for (let i = 0, len = keys.length; i < len; i++) {
                res[keys[i]] = resolved[i];
            }
            return res;
        });
    }
    // public static propsMap<R, U>(iterable: Resolvable<Iterable<Resolvable<R>>>, mapper: (output: { [index: string]: Resolvable<U> }, item: R, index: number | string) => void, options: { concurrency: number } = {concurrency: Infinity}): Promise<{ [index: string]: U }> {
    //
    //     let dto = {},index=0;
    //
    //     for (let item of iterable[Symbol.iterator]()) {
    //         mapper(dto, item,index)
    //         index++;
    //     }
    //
    //
    //     return Promises.props(dto, {concurrency: options.concurrency})
    // }
    static _mapWrapper(mapper, iterator, results, params) {
        let next = iterator.next();
        if (next.done) {
            return null;
        }
        let i = params.index++, mapped = mapper(next.value, i);
        return Promise.resolve(mapped).then(resolved => {
            results[i] = resolved;
            return Promises._mapWrapper(mapper, iterator, results, params);
        });
    }
    static filter(iterable, filterer, options = { concurrency: Infinity }) {
        let concurrency = options.concurrency || Infinity;
        let params = { index: 0 }, results = [], predicates = [], iterator = iterable[Symbol.iterator](), promises = [];
        while (concurrency-- > 0) {
            let promise = Promises._filterWrapper(filterer, iterator, results, predicates, params);
            if (!promise) {
                break;
            }
            promises.push(promise);
        }
        return Promise.all(promises).then(() => results.filter((v, i) => predicates[i]));
    }
    static _filterWrapper(filterer, iterator, results, predicates, params) {
        let next = iterator.next();
        if (next.done) {
            return null;
        }
        let i = params.index++;
        results.push(next.value);
        let predicate = filterer(next.value, i);
        return Promise.resolve(predicate).then(resolved => {
            predicates[i] = resolved;
            return Promises._filterWrapper(filterer, iterator, results, predicates, params);
        });
    }
    static fromCallback(resolver) {
        return new Promise((resolve, reject) => {
            resolver((err, data) => {
                if (err == null) {
                    resolve(data);
                }
                else {
                    reject(err);
                }
            });
        });
    }
    static defer() {
        return new Deferred();
    }
    static to(promise) {
        return promise.then(data => [null, data]).catch(e => [e]);
    }
    static allSettled(promises) {
        let settled = [];
        for (let i = 0; i < promises.length; i++) {
            let promise = promises[i]
                .then(value => ({ status: "fulfilled", value }))
                .catch(reason => ({ status: "rejected", reason }));
            settled.push(promise);
        }
        return Promise.all(settled);
    }
    static some(promises, { counter = 1 } = { counter: 1 }) {
        return new Promise((resolve) => {
            let settled = [];
            counter = Math.min(Math.max(Math.floor(counter), 1), promises.length);
            if (!promises.length) {
                resolve(settled);
            }
            for (let i = 0; i < promises.length; i++) {
                promises[i]
                    .then(value => (settled.push({ status: "fulfilled", value }) === counter) && resolve(settled))
                    .catch(reason => (settled.push({ status: "rejected", reason }) === counter) && resolve(settled));
            }
        });
    }
    static someRejected(promises, { counter = 1, fn = null } = {
        counter: 1,
        fn: null
    }) {
        return new Promise((resolve, reject) => {
            let resolved = [], rejected = [];
            if (!promises.length) {
                resolve(rejected);
            }
            counter = Math.min(Math.max(Math.floor(counter), 1), promises.length);
            let fnResolve = value => (resolved.push({ status: "fulfilled", value }) + rejected.length === promises.length)
                && resolve(rejected);
            let fnReject = reason => (rejected.push({ status: "rejected", reason }) === counter
                || resolved.length + rejected.length === promises.length) && resolve(rejected);
            for (let i = 0; i < promises.length; i++) {
                promises[i]
                    .then(value => fn ? (fn(value) ? fnResolve(value) : fnReject(value)) : fnResolve(value))
                    .catch(fnReject);
            }
        });
    }
    static someResolved(promises, { counter = 1, fn = null } = {
        counter: 1,
        fn: null
    }) {
        return new Promise((resolve, reject) => {
            let resolved = [], rejected = [];
            if (!promises.length) {
                resolve(resolved);
            }
            counter = Math.min(Math.max(Math.floor(counter), 1), promises.length);
            let fnResolve = value => (resolved.push({ status: "fulfilled", value }) === counter
                || resolved.length + rejected.length === promises.length) && resolve(resolved);
            let fnReject = reason => (rejected.push({ status: "rejected", reason }) + resolved.length === promises.length)
                && resolve(resolved);
            for (let i = 0; i < promises.length; i++) {
                promises[i]
                    .then(value => fn ? (fn(value) ? fnResolve(value) : fnReject(value)) : fnResolve(value))
                    .catch(fnReject);
            }
        });
    }
    static isPromise(obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function' && typeof obj.catch === 'function';
    }
}
exports.Promises = Promises;
class Deferred {
    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this._resolveSelf = resolve;
            this._rejectSelf = reject;
        });
    }
    get promise() {
        return this._promise;
    }
    resolve(val) {
        this._resolveSelf(val);
    }
    reject(reason) {
        this._rejectSelf(reason);
    }
}
exports.Deferred = Deferred;
//# sourceMappingURL=promises.js.map