"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo_cache_1 = require("appolo-cache");
const appolo_utils_1 = require("appolo-utils");
function cache(cacheOptions = {}) {
    return function (target, propertyKey, descriptor) {
        let options = appolo_utils_1.Objects.defaults({}, cacheOptions);
        options.promiseCache = new Map();
        options.getMethod = options.peek ? "peek" : "get";
        if (options.refresh) {
            options.getMethod = options.peek ? "peekByExpire" : "getByExpire";
        }
        let _intervals = new Map();
        options.isPromise = false;
        const originalMethod = descriptor.value, cache = new appolo_cache_1.Cache(options), argsLength = descriptor.value.length;
        descriptor.value = function (...args) {
            let key = getKey(argsLength, this, options, arguments);
            if (options.interval && !_intervals.get(key)) {
                let interval = setInterval(refreshValue.bind(null, this, originalMethod, args, key, cache, options), options.interval);
                _intervals.set(key, interval);
            }
            let item = getValueFromMemory(this, originalMethod, key, args, cache, options);
            if (item) {
                return options.isPromise ? Promise.resolve(item) : item;
            }
            let result = getValue(this, originalMethod, args, key, cache, options);
            return result;
        };
        descriptor.value.cache = cache;
        return descriptor;
    };
    function getKey(argsLength, scope, options, args) {
        if (options.resolver) {
            return options.resolver.apply(scope, args);
        }
        if ((argsLength > 1 && options.multi)) {
            return JSON.stringify(args);
        }
        let arg = args[0];
        return typeof arg == "object" ? JSON.stringify(arg) : arg;
    }
    function getValueFromMemory(scope, originalMethod, key, args, cache, options) {
        let result = cache[options.getMethod](key);
        if (!result) {
            return null;
        }
        let value = result;
        if (options.refresh) {
            value = result.value;
            if (!result.validExpire) {
                refreshValue(scope, originalMethod, args, key, cache, options);
            }
        }
        return options.clone ? JSON.parse(value) : value;
    }
    function refreshValue(scope, originalMethod, args, key, cache, options) {
        let value = getValue(scope, originalMethod, args, key, cache, options);
        Promise.resolve(value).catch((e) => {
            if (options.logger) {
                options.logger.error(`failed to refresh ${key}`, { e });
            }
        });
    }
    function getValue(scope, originalMethod, args, key, cache, options) {
        let promiseCacheItem = options.promiseCache.get(key);
        if (promiseCacheItem) {
            return promiseCacheItem;
        }
        let result = originalMethod.apply(scope, args);
        if (!result || !result.then || !result.catch) {
            cache.set(key, options.clone ? JSON.stringify(result) : result, options.maxAge);
            return result;
        }
        options.isPromise = true;
        let value = result.then((data) => {
            cache.set(key, options.clone ? JSON.stringify(data) : data, options.maxAge);
            options.promiseCache.delete(key);
            return data;
        }).catch((e) => {
            options.promiseCache.delete(key);
            throw e;
        });
        options.promiseCache.set(key, value);
        return value;
    }
}
exports.cache = cache;
//# sourceMappingURL=cache.js.map