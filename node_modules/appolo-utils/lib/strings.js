"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
class Strings {
    static stringifyObjectValues(obj) {
        let s = '';
        for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
                s = s + obj[k];
            }
        }
        return s;
    }
    static isString(str) {
        return (typeof str === 'string' || str instanceof String);
    }
    static removeNewLine(str) {
        return str.replace(/(\r\n|\n|\r)/gm, "");
    }
    static replaceFormat(str, data) {
        return str.replace(/\$\{([\w\.\_]*)\}/gm, (m, key) => data.hasOwnProperty(key) ? ((!data[key] && data[key] !== false) ? "" : data[key]) : m);
    }
    static removeNonAsciiChars(fromString) {
        if (typeof (fromString) === "string") {
            return fromString.replace(/[^\x00-\x7F]/g, "").replace(/\s\s+/g, ' ');
        }
        return fromString;
    }
    static tryDecodeURIComponent(str) {
        let [err, output] = index_1.Functions.to(() => decodeURIComponent(str || ""));
        return err ? str || "" : output;
    }
}
exports.Strings = Strings;
//# sourceMappingURL=strings.js.map