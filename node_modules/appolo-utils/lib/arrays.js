"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("./classes");
class Arrays {
    static clone(arr) {
        return arr.slice(0);
    }
    static arrayify(val) {
        return Array.isArray(val) ? val : [val];
    }
    static compact(array) {
        let index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
        while (++index < length) {
            let value = array[index];
            if (value) {
                result[resIndex++] = value;
            }
        }
        return result;
    }
    static random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    static removeBy(list, criteria) {
        if (!list || !list.length) {
            return;
        }
        for (let i = list.length - 1; i >= 0; i--) {
            if (criteria(list[i], i)) {
                list.splice(i, 1);
            }
        }
    }
    static remove(list, item) {
        Arrays.removeBy(list, current => current === item);
    }
    static chunk(array, chunkSize) {
        return Arrays.splitToChunks(array, chunkSize);
    }
    static splitToChunks(array, chunkSize) {
        return [].concat.apply([], array.map(function (elem, i) {
            return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
        }));
    }
    static groupBy(arr, key) {
        let output = {};
        for (let i = 0, len = arr.length; i < len; i++) {
            let item = arr[i], value = (typeof key === "function") ? key(item) : item[key], dto = output[value] || (output[value] = []);
            dto.push(item);
        }
        return output;
    }
    static keyBy(arr, key) {
        if (!key) {
            key = (item, index) => item.toString();
        }
        let output = {}, isFn = classes_1.Classes.isFunction(key);
        for (let i = 0, len = (arr || []).length; i < len; i++) {
            let item = arr[i];
            let outputKey = isFn ? key(item, i) : item[key];
            output[outputKey] = item;
        }
        return output;
    }
    static flat(arr) {
        return arr.reduce((acc, val) => acc.concat(val), []);
    }
    static flatDeep(arr, depth = 1) {
        return depth > 0
            ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? Arrays.flatDeep(val, depth - 1) : val), [])
            : arr.slice();
    }
    static partition(arr, criteria) {
        let arr1 = [], arr2 = [];
        for (let i = 0, len = (arr || []).length; i < len; i++) {
            let value = arr[i];
            criteria(value) ? arr1.push(value) : arr2.push(value);
        }
        return [arr1, arr2];
    }
    static sortBy(arr, criteria) {
        arr = Arrays.clone(arr);
        arr.sort((a, b) => {
            let valueA = criteria(a), valueB = criteria(b);
            return (valueA > valueB) ? 1 : ((valueB > valueA) ? -1 : 0);
        });
        return arr;
    }
    static zip(arr, ...args) {
        return arr.map((value, idx) => [value, ...args.map(arr => arr[idx])]);
    }
    static sort(arr) {
        let criteria = ((value) => value);
        arr = Arrays.clone(arr);
        arr.sort((a, b) => {
            let valueA = criteria(a), valueB = criteria(b);
            return (valueA > valueB) ? 1 : ((valueB > valueA) ? -1 : 0);
        });
        return arr;
    }
    static map(arr, criteria) {
        if (!arr) {
            return [];
        }
        if (!Array.isArray(arr)) {
            return Object.keys(arr).map(key => criteria(arr[key], key));
        }
        return arr.map(criteria);
    }
    static forEach(arr, criteria) {
        if (!arr) {
            return;
        }
        if (!Array.isArray(arr)) {
            Object.keys(arr).forEach(key => criteria(arr[key], key));
            return;
        }
        arr.forEach(criteria);
    }
    static uniqBy(arr, criteria) {
        let dic = new Map(), out = [];
        if (!arr || !arr.length) {
            return [];
        }
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i], key = criteria(item, i);
            if (!dic.has(key)) {
                dic.set(key, 1);
                out.push(item);
            }
        }
        return out;
    }
    static uniq(arr) {
        return Arrays.uniqBy(arr, (item) => item);
    }
    static sumBy(arr, criteria) {
        if (!arr || !arr.length) {
            return 0;
        }
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i], num = criteria(item, i);
            sum += num;
        }
        return sum;
    }
    static sum(arr) {
        return Arrays.sumBy(arr, item => item);
    }
}
exports.Arrays = Arrays;
//# sourceMappingURL=arrays.js.map