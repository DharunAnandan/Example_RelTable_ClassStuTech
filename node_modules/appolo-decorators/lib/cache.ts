import {Cache} from "appolo-cache";
import Timer = NodeJS.Timer;
import {Objects} from 'appolo-utils';

interface IOptions {
    resolver?: Function;
    maxSize?: number;
    maxAge?: number;
    clone?: boolean;
    peek?: boolean;
    refresh?: boolean;
    logger?: { error: (...args: any[]) => void };
    interval?: number;
    multi?: boolean

}

interface IInnerOptions extends IOptions {
    isPromise?: boolean;
    timer?: Timer | number;
    promiseCache?: Map<any, any>

    getMethod?: "get" | "peek" | "getByExpire" | "peekByExpire"

}


export function cache(cacheOptions: IOptions = {}) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        let options: IInnerOptions = Objects.defaults({}, cacheOptions as any);

        options.promiseCache = new Map<any, any>();

        options.getMethod = options.peek ? "peek" : "get";

        if (options.refresh) {
            options.getMethod = options.peek ? "peekByExpire" : "getByExpire";
        }

        let _intervals = new Map<any, Timer>();

        options.isPromise = false;

        const originalMethod = descriptor.value,
            cache = new Cache(options),
            argsLength = descriptor.value.length;

        descriptor.value = function (...args) {

            let key = getKey(argsLength, this, options, arguments);

            if (options.interval && !_intervals.get(key)) {

                let interval = setInterval(refreshValue.bind(null, this, originalMethod, args, key, cache, options), options.interval);

                _intervals.set(key, interval)
            }

            let item = getValueFromMemory(this, originalMethod, key, args, cache, options);

            if (item) {
                return options.isPromise ? Promise.resolve(item) : item
            }

            let result = getValue(this, originalMethod, args, key, cache, options);

            return result


        };

        descriptor.value.cache = cache;

        return descriptor;
    };

    function getKey(argsLength: number, scope: any, options: IInnerOptions, args: any) {
        if (options.resolver) {
            return options.resolver.apply(scope, args)
        }

        if ((argsLength > 1 && options.multi)) {
            return JSON.stringify(args)
        }

        let arg = args[0];

        return typeof arg == "object" ? JSON.stringify(arg) : arg
    }

    function getValueFromMemory(scope: any, originalMethod: any, key: any, args: any[], cache: Cache<any, any>, options: IInnerOptions) {

        let result = cache[options.getMethod](key);

        if (!result) {
            return null;
        }

        let value = result;

        if (options.refresh) {
            value = result.value;

            if (!result.validExpire) {
                refreshValue(scope, originalMethod, args, key, cache, options)
            }
        }

        return options.clone ? JSON.parse(value) : value;

    }

    function refreshValue(scope: any, originalMethod: any, args: any[], key: any, cache: Cache<any, any>, options: IOptions) {
        let value = getValue(scope, originalMethod, args, key, cache, options);

        Promise.resolve(value).catch((e) => {
            if (options.logger) {
                options.logger.error(`failed to refresh ${key}`, {e})
            }
        })
    }

    function getValue(scope: any, originalMethod: any, args: any[], key: any, cache: Cache<any, any>, options: IInnerOptions): Promise<any> | any {

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
            return data
        }).catch((e) => {
            options.promiseCache.delete(key);
            throw e;
        });

        options.promiseCache.set(key, value);

        return value
    }
}
