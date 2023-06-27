import {Arrays} from "./arrays";

export class Objects {
    public static isPlain(obj: any): boolean {

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

    public static isObject(val: any): boolean {
        return val != null && typeof val === 'object' && Object.prototype.toString.call(val) === '[object Object]';
    }

    public static isEmpty(obj: { [index: string]: any }): boolean {
        return Object.keys(obj || {}).length === 0
    }

    public static cloneFast<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj))
    }

    public static defaults<T>(obj: Partial<T>, ...args: Partial<T>[]): T {

        for (let i = 0, len = args.length; i < len; i++) {
            let arg = args[i];
            let keys = Object.keys(arg || {});
            for (let j = 0, len2 = keys.length; j < len2; j++) {
                let key = keys[j];
                if (!(key in obj)) {
                    obj[key] = arg[key]
                }
            }
        }

        return obj as T;
    };

    public static cloneDeep<T>(obj: T): T {

        let output = Array.isArray(obj) ? [] : {};

        let keys = Object.keys(obj || {});

        for (let i = 0, len = keys.length; i < len; i++) {

            let key = keys[i], value = obj[key];
            output[key] = (value !== null && value !== undefined && (Array.isArray(value) || Objects.isPlain(value)))
                ? Objects.cloneDeep(value)
                : value
        }

        return output as any;
    }

    public static clone<T>(obj: T): T {

        let output = Array.isArray(obj) ? [] : {};

        let keys = Object.keys(obj || {});

        for (let i = 0, len = keys.length; i < len; i++) {

            let key = keys[i];
            output[key] = obj[key]
        }

        return output as any;
    }

    public static compact(obj: any): any {

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

    public static tryParseJSON(jsonString: string): any {
        try {

            let o = JSON.parse(jsonString);

            return o;
        } catch (e) {
        }

        return null;
    }

    public static pick<T extends object, U extends keyof T>(obj: T, ...pick: U[]): Pick<T, U> {
        let out: any = {};
        obj = obj || {} as T;
        for (let i = 0; i < pick.length; i++) {
            let key = pick[i];
            if(key in obj){
                out[key] = obj[key];
            }
        }

        return out
    }

    public static omit<T extends object, U extends keyof T>(obj: T, ...omit: U[]): Omit<T, U> {
        let out: any = {}, keys = Object.keys(obj || {}), omitIndex = Arrays.keyBy(omit);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (!omitIndex[key]) {
                out[key] = obj[key];
            }

        }

        return out
    }

}
