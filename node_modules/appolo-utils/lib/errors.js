"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
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
    static errorToString(err) {
        let output = "";
        if (!err) {
            return output;
        }
        return (err instanceof Error)
            ? err.stack || err.toString()
            : index_1.Objects.tryStringifyJSON(err);
    }
}
exports.Errors = Errors;
//# sourceMappingURL=errors.js.map