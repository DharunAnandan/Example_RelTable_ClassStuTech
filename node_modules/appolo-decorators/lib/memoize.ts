import {Functions} from 'appolo-utils';

export function memoize(resolver?: Function) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;

        descriptor.value = Functions.memoize(originalMethod);

        return descriptor;
    }
}
