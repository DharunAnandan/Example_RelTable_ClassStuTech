"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo_utils_1 = require("appolo-utils");
function throttle(milliseconds = 0) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = appolo_utils_1.Functions.throttle(originalMethod, milliseconds);
        return descriptor;
    };
}
exports.throttle = throttle;
//# sourceMappingURL=throttle.js.map