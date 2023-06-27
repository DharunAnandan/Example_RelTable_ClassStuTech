export function bind(target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void {
    if (!descriptor || (typeof descriptor.value !== "function")) {
        throw new TypeError(`${propertyKey} is not a method`);
    }

    return {
        configurable: true,
        get(this: any): any {
            const bound: any = descriptor.value.bind(this);
            Object.defineProperty(this, propertyKey, {
                value: bound,
                configurable: true,
                writable: true
            });
            return bound;
        }
    };
}