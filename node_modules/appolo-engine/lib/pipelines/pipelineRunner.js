"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPipes = void 0;
const pipelineContext_1 = require("./pipelineContext");
function runPipes(pipes) {
    return function (context, next) {
        let params = { index: -1, pipes, context, next };
        return run(0, params);
    };
}
exports.runPipes = runPipes;
function run(i, params) {
    if (i <= params.index) {
        return Promise.reject(new Error('next() already called'));
    }
    let pipe = params.pipes[i];
    if (!pipe || !pipe.pipeline) {
        return Promise.resolve();
    }
    params.index = i;
    let fn = pipe.pipeline;
    if (i === params.pipes.length) {
        fn = params.next;
    }
    if (!fn) {
        return Promise.resolve();
    }
    try {
        let next = run.bind(null, i + 1, params);
        let context = new pipelineContext_1.PipelineContext(params.context, pipe.index, pipe.metaData, pipe.options);
        let result = fn(context, next);
        return Promise.resolve(result);
    }
    catch (err) {
        return Promise.reject(err);
    }
}
//# sourceMappingURL=pipelineRunner.js.map