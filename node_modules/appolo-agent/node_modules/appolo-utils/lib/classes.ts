import {Arrays} from "./arrays";
import {Functions} from "../index";

export class Classes {
    public static isClass(v: any): boolean {
        return typeof v === 'function' && v.name && /^\s*class\s+/.test(v.toString());
    }

    public static isFunction(obj: any): boolean {
        return Functions.isFunction(obj);
    };

    public static className(fn: Function): string {
        return fn.name.charAt(0).toLowerCase() + fn.name.slice(1)
    }

    public static functionArgsNames(func: ((...args: any[]) => any) | (new(...args: any[]) => any)) {

        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        const ARGUMENT_NAMES = /([^\s,]+)/g;

        let fnStr = func.toString().replace(STRIP_COMMENTS, '');
        let args = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);

        if (args === null) {
            args = [];
        }

        args = Arrays.compact(args);

        return args;
    }

    // public static  getAllClassMethods(klass:(new(...args: any[])=> any)):string[] {
    //     let props = [];
    //     let obj = klass;
    //     do {
    //
    //         let keys = Object.getOwnPropertyDescriptors(obj);
    //
    //         for(let i =0;i<keys.length;i++){
    //
    //         }
    //
    //         props = props.concat();
    //     } while (obj = Object.getPrototypeOf(obj));
    //
    //     // return props.sort().filter(function(e, i, arr) {
    //     //     if (e!=arr[i+1] && typeof toCheck[e] == 'function') return true;
    //     // });
    // }
}
