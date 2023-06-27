import {IMetadata, IPipelineCtr, IPipelineFn, IPipelineMetadata} from "../pipelines/IPipeline";
import {Reflector} from "appolo-utils";

export const PipeSymbol = "__PipeSymbol__";
export const PipeSetSymbol = "__PipeSetSymbol__";

export const PipeKlassRegisterSymbol = "__PipeKlassRegisterSymbol__";
export const PipeInstanceCreateSymbol = "__PipeInstanceCreateSymbol__";


export function pipeline(pipeline: IPipelineFn | IPipelineCtr, metaData?: any, options?: any) {

    return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor | number) {
        let result: IMetadata = Reflector.getMetadata(PipeSymbol, target.constructor, undefined, {});

        if (!result[propertyKey]) {
            result[propertyKey] = [];
        }

        let index: number = NaN;

        let isParam = typeof descriptor == "number";

        if (isParam) {
            index = descriptor as number;
        }

        result[propertyKey][isParam ? "unshift" : "push"]({pipeline, metaData, options, index})
    }
}

export function pipelineType(pipeline: IPipelineFn | IPipelineCtr, metaData?: any, options?: any) {

    return function (target: any) {
        let result: IPipelineMetadata[] = Reflector.getFnMetadata(PipeKlassRegisterSymbol, target, []);
        result.push({
            pipeline,
            metaData,
            options,
        })
    }
}

export function pipelineInstance(pipeline: IPipelineFn | IPipelineCtr, metaData?: any, options?: any) {

    return function (target: any) {
        let result: IPipelineMetadata[] = Reflector.getFnMetadata(PipeInstanceCreateSymbol, target, []);
        result.push({
            pipeline,
            metaData,
            options,
        })
    }
}
