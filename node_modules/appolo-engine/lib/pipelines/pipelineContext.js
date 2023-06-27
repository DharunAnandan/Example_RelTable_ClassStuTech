"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineContext = void 0;
class PipelineContext {
    constructor(_context, _index, _metaData, _options) {
        this._context = _context;
        this._index = _index;
        this._metaData = _metaData;
        this._options = _options;
    }
    get metaData() {
        return this._metaData;
    }
    get options() {
        return this._options;
    }
    get index() {
        return this._index;
    }
    get arguments() {
        return this._context.args;
    }
    get instance() {
        return this._context.instance;
    }
    originFn() {
        return this._context.instance[this._context.action]["__PIPELINE__"];
    }
    get type() {
        return this._context.type;
    }
    get action() {
        return this._context.action;
    }
    get argumentsTypes() {
        return this._context.argsTypes || [];
    }
    get isArgument() {
        return !isNaN(this._index);
    }
    setArgumentAt(index, value) {
        this.arguments[index] = value;
    }
    getArgumentAt(index) {
        return this.arguments[index];
    }
    get value() {
        if (this.isArgument) {
            return this.arguments[this._index];
        }
    }
    get values() {
        if (this.isArgument) {
            return [{
                    index: this._index,
                    value: this.getArgumentAt(this._index),
                    type: this.argumentsTypes[this._index]
                }];
        }
        return Array.from(this.arguments).map((value, index) => ({ index, value, type: this.argumentsTypes[index] }));
    }
}
exports.PipelineContext = PipelineContext;
//# sourceMappingURL=pipelineContext.js.map