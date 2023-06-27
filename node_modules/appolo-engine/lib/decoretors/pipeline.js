"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelineInstance = exports.pipelineType = exports.pipeline = exports.PipeInstanceCreateSymbol = exports.PipeKlassRegisterSymbol = exports.PipeSetSymbol = exports.PipeSymbol = void 0;
const appolo_utils_1 = require("appolo-utils");
exports.PipeSymbol = "__PipeSymbol__";
exports.PipeSetSymbol = "__PipeSetSymbol__";
exports.PipeKlassRegisterSymbol = "__PipeKlassRegisterSymbol__";
exports.PipeInstanceCreateSymbol = "__PipeInstanceCreateSymbol__";
function pipeline(pipeline, metaData, options) {
    return function (target, propertyKey, descriptor) {
        let result = appolo_utils_1.Reflector.getMetadata(exports.PipeSymbol, target.constructor, undefined, {});
        if (!result[propertyKey]) {
            result[propertyKey] = [];
        }
        let index = NaN;
        let isParam = typeof descriptor == "number";
        if (isParam) {
            index = descriptor;
        }
        result[propertyKey][isParam ? "unshift" : "push"]({ pipeline, metaData, options, index });
    };
}
exports.pipeline = pipeline;
function pipelineType(pipeline, metaData, options) {
    return function (target) {
        let result = appolo_utils_1.Reflector.getFnMetadata(exports.PipeKlassRegisterSymbol, target, []);
        result.push({
            pipeline,
            metaData,
            options,
        });
    };
}
exports.pipelineType = pipelineType;
function pipelineInstance(pipeline, metaData, options) {
    return function (target) {
        let result = appolo_utils_1.Reflector.getFnMetadata(exports.PipeInstanceCreateSymbol, target, []);
        result.push({
            pipeline,
            metaData,
            options,
        });
    };
}
exports.pipelineInstance = pipelineInstance;
//# sourceMappingURL=pipeline.js.map