"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Errors {
    static stack() {
        let pst = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
            Error.prepareStackTrace = pst;
            return stack;
        };
        let stack = (new Error()).stack;
        return stack;
    }
}
exports.Errors = Errors;
//# sourceMappingURL=errors.js.map