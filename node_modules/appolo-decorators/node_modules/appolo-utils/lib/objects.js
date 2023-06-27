"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arrays_1 = require("./arrays");
class Objects {
    static isPlain(obj) {
        if (!Objects.isObject(obj)) {
            return false;
        }
        let ctor = obj.constructor;
        if (typeof ctor !== 'function') {
            return false;
        }
        let proto = ctor.prototype;
        if (!Objects.isObject(proto) || !proto.hasOwnProperty('isPrototypeOf')) {
            return false;
        }
        return true;
    }
    static isObject(val) {
        return val != null && typeof val === 'object' && Object.prototype.toString.call(val) === '[object Object]';
    }
    static isEmpty(obj) {
        return Object.keys(obj || {}).length === 0;
    }
    static cloneFast(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    static defaults(obj, ...args) {
        for (let i = 0, len = args.length; i < len; i++) {
            let arg = args[i];
            let keys = Object.keys(arg || {});
            for (let j = 0, len2 = keys.length; j < len2; j++) {
                let key = keys[j];
                if (!(key in obj)) {
                    obj[key] = arg[key];
                }
            }
        }
        return obj;
    }
    ;
    static cloneDeep(obj) {
        let output = Array.isArray(obj) ? [] : {};
        let keys = Object.keys(obj || {});
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i], value = obj[key];
            output[key] = (value !== null && value !== undefined && (Array.isArray(value) || Objects.isPlain(value)))
                ? Objects.cloneDeep(value)
                : value;
        }
        return output;
    }
    static clone(obj) {
        let output = Array.isArray(obj) ? [] : {};
        let keys = Object.keys(obj || {});
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            output[key] = obj[key];
        }
        return output;
    }
    static compact(obj) {
        let output = {};
        let keys = Object.keys(obj || {});
        for (let i = 0, length = keys.length; i < length; i++) {
            let key = keys[i], item = obj[key];
            if (!item && !(item == 0 || item == false)) {
                continue;
            }
            output[key] = item;
        }
        return output;
    }
    static tryParseJSON(jsonString) {
        try {
            let o = JSON.parse(jsonString);
            return o;
        }
        catch (e) {
        }
        return null;
    }
    static pick(obj, ...pick) {
        let out = {};
        obj = obj || {};
        for (let i = 0; i < pick.length; i++) {
            let key = pick[i];
            if (key in obj) {
                out[key] = obj[key];
            }
        }
        return out;
    }
    static omit(obj, ...omit) {
        let out = {}, keys = Object.keys(obj || {}), omitIndex = arrays_1.Arrays.keyBy(omit);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (!omitIndex[key]) {
                out[key] = obj[key];
            }
        }
        return out;
    }
}
exports.Objects = Objects;
//# sourceMappingURL=objects.js.map