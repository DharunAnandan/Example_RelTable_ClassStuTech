"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numbers_1 = require("./numbers");
const arrays_1 = require("./arrays");
const classes_1 = require("./classes");
const guid_1 = require("./guid");
const hash_1 = require("./hash");
const objects_1 = require("./objects");
const promises_1 = require("./promises/promises");
const strings_1 = require("./strings");
const time_1 = require("./time");
const files_1 = require("./files");
const enums_1 = require("./enums");
const reflector_1 = require("./reflector");
const functions_1 = require("./functions");
const errors_1 = require("./errors");
class Util {
    static get numbers() {
        return numbers_1.Numbers;
    }
    static get arrays() {
        return arrays_1.Arrays;
    }
    static get classes() {
        return classes_1.Classes;
    }
    static get guid() {
        return guid_1.Guid;
    }
    static get hash() {
        return hash_1.Hash;
    }
    static get objects() {
        return objects_1.Objects;
    }
    static get promises() {
        return promises_1.Promises;
    }
    static get strings() {
        return strings_1.Strings;
    }
    static get time() {
        return time_1.Time;
    }
    static get files() {
        return files_1.Files;
    }
    static get enums() {
        return enums_1.Enums;
    }
    static get functions() {
        return functions_1.Functions;
    }
    static get Reflector() {
        return reflector_1.Reflector;
    }
    static get errors() {
        return errors_1.Errors;
    }
}
exports.Util = Util;
//# sourceMappingURL=util.js.map