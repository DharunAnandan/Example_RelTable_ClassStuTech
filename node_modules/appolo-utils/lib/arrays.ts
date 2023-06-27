import {Classes} from "./classes";

export class Arrays {
    public static clone<T>(arr: T[]): T[] {
        return arr.slice(0);
    }

    public static arrayify<T>(val: any): T[] {
        return Array.isArray(val) ? val : [val];
    }

    public static compact<T>(array: T[]): T[] {
        let index = -1,
            length = array == null ? 0 : array.length,
            resIndex = 0,
            result = [];

        while (++index < length) {
            let value = array[index];
            if (value) {
                result[resIndex++] = value;
            }
        }
        return result;
    }

    public static random<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }


    public static removeBy<T>(list: T[], criteria: (value: T, i?: number) => boolean): void {
        if (!list || !list.length) {
            return;
        }

        for (let i = list.length - 1; i >= 0; i--) {
            if (criteria(list[i], i)) {
                list.splice(i, 1);
            }
        }
    }

    public static remove<T>(list: T[], item: T): void {
        Arrays.removeBy(list, current => current === item)
    }

    public static chunk(array: any[], chunkSize: number): any[] {
        return Arrays.splitToChunks(array, chunkSize)
    }

    public static splitToChunks(array: any[], chunkSize: number): any[] {

        return [].concat.apply([],
            array.map(function (elem, i) {
                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
            })
        )
    }

    public static groupBy<T>(arr: T[], key: string | number | ((item: T) => string | number)): { [index: string]: T[] } {

        let output: { [index: string]: T[] } = {};

        for (let i = 0, len = arr.length; i < len; i++) {
            let item = arr[i],
                value = (typeof key === "function") ? key(item) : item[key],
                dto = output[value] || (output[value] = []);

            dto.push(item);
        }

        return output;
    }

    public static keyBy<T extends any>(arr: T[], key?: string | ((item: T, index: number) => string)): { [index: string]: T } {

        if (!key) {
            key = (item: T, index: number) => item.toString();
        }

        let output: { [index: string]: T } = {}, isFn = Classes.isFunction(key);

        for (let i = 0, len = (arr || []).length; i < len; i++) {

            let item: any = arr[i];

            let outputKey = isFn ? (key as Function)(item, i) : item[key as string];

            output[outputKey] = item;
        }

        return output;
    }

    public static flat<T>(arr: any[]): T[] {
        return arr.reduce((acc, val) => acc.concat(val), []);
    }

    public static flatDeep<T>(arr: any[], depth: number = 1): T[] {
        return depth > 0
            ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? Arrays.flatDeep(val, depth - 1) : val), [])
            : arr.slice();
    }

    public static partition<T>(arr: T[], criteria: (value: T) => boolean): [T[], T[]] {
        let arr1 = [], arr2 = [];

        for (let i = 0, len = (arr || []).length; i < len; i++) {

            let value = arr[i];

            criteria(value) ? arr1.push(value) : arr2.push(value);
        }

        return [arr1, arr2]
    }

    public static sortBy<T>(arr: T[], criteria: (value: T) => any): T[] {
        arr = Arrays.clone(arr);

        arr.sort((a, b) => {
            let valueA = criteria(a), valueB = criteria(b);
            return (valueA > valueB) ? 1 : ((valueB > valueA) ? -1 : 0);
        });

        return arr;
    }


    public static zip<T>(arr: T[], ...args: Array<T>): Array<Array<T | undefined>> {
        return arr.map((value, idx) => [value, ...args.map(arr => arr[idx])])
    }


    public static sort<T>(arr: T[]): T[] {

        let criteria = ((value) => value);
        arr = Arrays.clone(arr);

        arr.sort((a, b) => {
            let valueA = criteria(a), valueB = criteria(b);
            return (valueA > valueB) ? 1 : ((valueB > valueA) ? -1 : 0);
        });

        return arr;
    }

    public static map<T, K>(arr: T[] | { [index: string]: T }, criteria: (value: T, i?: number | string) => K): K[] {
        if (!arr) {
            return []
        }

        if (!Array.isArray(arr)) {
            return Object.keys(arr).map(key => criteria(arr[key], key))
        }

        return arr.map(criteria)
    }

    public static forEach<T>(arr: T[] | { [index: string]: T }, criteria: (value: T, i?: number | string) => void): void {
        if (!arr) {
            return;
        }

        if (!Array.isArray(arr)) {
            Object.keys(arr).forEach(key => criteria(arr[key], key));
            return;
        }

        arr.forEach(criteria);
    }

    public static uniqBy<T>(arr: T[], criteria: (value: T, i?: number) => any): T[] {
        let dic = new Map<any, 1>(), out = [];
        if (!arr || !arr.length) {
            return []
        }
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i], key = criteria(item, i);
            if (!dic.has(key)) {
                dic.set(key, 1);
                out.push(item)
            }
        }

        return out;
    }

    public static uniq<T>(arr: T[]): T[] {
        return Arrays.uniqBy(arr, (item) => item)
    }

    public static sumBy<T>(arr: T[], criteria: (value: T, i?: number) => number): number {
        if (!arr || !arr.length) {
            return 0
        }
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i], num = criteria(item, i);
            sum += num
        }

        return sum;
    }

    public static sum(arr: number[]): number {
        return Arrays.sumBy(arr, item => item);
    }
}
