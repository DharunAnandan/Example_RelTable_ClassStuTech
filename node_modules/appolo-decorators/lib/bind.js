"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bind(target, propertyKey, descriptor) {
    if (!descriptor || (typeof descriptor.value !== "function")) {
        throw new TypeError(`${propertyKey} is not a method`);
    }
    return {
        configurable: true,
        get() {
            const bound = descriptor.value.bind(this);
            Object.defineProperty(this, propertyKey, {
                value: bound,
                configurable: true,
                writable: true
            });
            return bound;
        }
    };
}
exports.bind = bind;
//# sourceMappingURL=bind.js.map