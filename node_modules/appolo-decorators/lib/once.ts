export function once(n: number = 1) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;
        let counter = 0;
        let value: any;

        descriptor.value = function (...args) {

            if (counter < n) {
                value = originalMethod.apply(this, args);

                counter++;
            }

            return value;
        };

        return descriptor;
    }

}