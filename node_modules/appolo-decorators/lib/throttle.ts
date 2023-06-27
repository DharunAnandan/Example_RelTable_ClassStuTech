import {Functions}  from 'appolo-utils';

export function throttle(milliseconds: number = 0) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;

        descriptor.value = Functions.throttle(originalMethod, milliseconds);

        return descriptor;
    }
}
