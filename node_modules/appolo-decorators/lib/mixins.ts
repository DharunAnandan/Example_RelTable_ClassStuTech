import {Functions} from 'appolo-utils';

export function mixins(mixins: Function | Function[]): (fn: Function) => void {
    return function (fn: Function) {

        Functions.mixins(fn, mixins);
    }
}
