"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deferred_1 = require("./deferred");
const promiseMap_1 = require("./promiseMap");
const promiseFilter_1 = require("./promiseFilter");
const promiseSome_1 = require("./promiseSome");
class Promises {
    static delay(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    static map(iterable, mapper, options = { concurrency: Infinity }) {
        return promiseMap_1.PromiseMap.map(iterable, mapper, options);
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
    static filter(iterable, filterer, options = { concurrency: Infinity }) {
        return promiseFilter_1.PromiseFilter.filter(iterable, filterer, options);
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
        return new deferred_1.Deferred();
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
    static some(promises, opts = {}) {
        return promiseSome_1.PromiseSome.some(promises, opts);
    }
    static someRejected(promises, opts = {}) {
        return promiseSome_1.PromiseSome.someRejected(promises, opts);
    }
    static someResolved(promises, opts = {}) {
        return promiseSome_1.PromiseSome.someResolved(promises, opts);
    }
    static isPromise(obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function' && typeof obj.catch === 'function';
    }
    static timeout(promise, timeout) {
        return Promises.promiseTimeout(promise, timeout);
    }
    static async retry(fn, retires = 1) {
        let [err, result] = await Promises.to(fn());
        if (err == null) {
            return result;
        }
        if (retires <= 0) {
            throw err;
        }
        return Promises.retry(fn, --retires);
    }
    static promiseTimeout(promise, timeout) {
        return new Promise((resolve, reject) => {
            let interval = setTimeout(() => reject(new Error("promise timeout")), timeout);
            promise
                .then(resolve)
                .catch(reject)
                .finally(() => clearTimeout(interval));
        });
    }
}
exports.Promises = Promises;
//# sourceMappingURL=promises.js.map