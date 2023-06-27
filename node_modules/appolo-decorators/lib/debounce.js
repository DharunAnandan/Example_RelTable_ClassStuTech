"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo_utils_1 = require("appolo-utils");
function debounce(milliseconds = 0, immediate = false) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = appolo_utils_1.Functions.debounce(originalMethod, milliseconds, immediate);
        return descriptor;
    };
}
exports.debounce = debounce;
//# sourceMappingURL=debounce.js.map