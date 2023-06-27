"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const fs = require("fs");
const appolo_inject_1 = require("appolo-inject");
const appolo_utils_1 = require("appolo-utils");
class Util extends appolo_inject_1.Util {
    static async loadPathWithArgs(paths, injector) {
        for (let path of paths) {
            if (!fs.existsSync(path)) {
                continue;
            }
            let modulesFunc = require(path);
            if (!appolo_utils_1.Classes.isFunction(modulesFunc)) {
                continue;
            }
            let args = Util.getFunctionArgs(modulesFunc);
            let dependencies = args.map(arg => injector.getObject(arg));
            let result = modulesFunc.apply(modulesFunc, dependencies);
            //check for promise
            if (result && result.then) {
                await result;
            }
        }
    }
    static stack() {
        return appolo_utils_1.Errors.stack();
    }
    static callerPath() {
        let stack = Util.stack();
        return stack[4] && stack[4].getFileName ? stack[4].getFileName() : "";
    }
    static mixins(_klass, mixins) {
        return appolo_utils_1.Functions.mixins(_klass, mixins);
    }
    static delay(delay) {
        return appolo_utils_1.Promises.delay(delay);
    }
    static logger(injector) {
        if (injector.getDefinition("logger")) {
            let logger = injector.get("logger");
            return logger.info && logger.error ? logger : console;
        }
        return console;
    }
    static findReflectData(symbol, exported) {
        return appolo_utils_1.Reflector.findReflectData(symbol, exported);
    }
    static findAllReflectData(symbol, exported) {
        return appolo_utils_1.Reflector.findAllReflectData(symbol, exported);
    }
    static setReflectMetadata(key, value, target, propertyKey) {
        return appolo_utils_1.Reflector.setMetadata(key, value, target, propertyKey);
    }
    static getReflectMetadata(symbol, klass, propertyName, defaultValue) {
        return appolo_utils_1.Reflector.getMetadata(symbol, klass, propertyName, defaultValue);
    }
    static decorateReflectMetadata(key, value) {
        return appolo_utils_1.Reflector.decorateMetadata(key, value);
    }
}
exports.Util = Util;
//# sourceMappingURL=util.js.map