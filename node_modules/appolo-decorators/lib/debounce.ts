import {Functions} from 'appolo-utils';

export function debounce(milliseconds: number = 0, immediate = false) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;

        descriptor.value = Functions.debounce(originalMethod, milliseconds, immediate);

        return descriptor;
    }
}
