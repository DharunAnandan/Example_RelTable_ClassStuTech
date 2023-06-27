"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
class Module {
    constructor(options = {}) {
        this._exports = [];
        this._fileExports = [];
        this._imports = [];
        this.Defaults = {};
        this._moduleOptions = options;
    }
    get defaults() {
        return this.Defaults;
    }
    get app() {
        return this._app;
    }
    set app(value) {
        this._app = value;
    }
    get parent() {
        return this._app.parent;
    }
    get root() {
        return this._app.root;
    }
    get rootParent() {
        return this._app.root;
    }
    get exports() {
        return this._exports;
    }
    set exports(value) {
        this._exports = value;
    }
    get fileExports() {
        return this._fileExports;
    }
    set fileExports(value) {
        this._fileExports = value;
    }
    set imports(value) {
        this._imports = value;
    }
    get imports() {
        return this._imports;
    }
    get moduleOptions() {
        return this._moduleOptions;
    }
    set moduleOptions(value) {
        this._moduleOptions = value;
    }
    beforeInitialize() {
    }
    beforeLaunch() {
    }
    afterInitialize() {
    }
}
exports.Module = Module;
//# sourceMappingURL=module.js.map