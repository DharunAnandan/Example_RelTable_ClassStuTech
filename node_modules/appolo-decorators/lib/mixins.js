"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo_utils_1 = require("appolo-utils");
function mixins(mixins) {
    return function (fn) {
        appolo_utils_1.Functions.mixins(fn, mixins);
    };
}
exports.mixins = mixins;
//# sourceMappingURL=mixins.js.map