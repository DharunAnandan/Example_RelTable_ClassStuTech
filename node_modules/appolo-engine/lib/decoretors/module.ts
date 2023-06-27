import path = require('path');
import {IModuleDefinition} from "../interfaces/IModuleDefinition";
import {Util} from "../util/util";

export const ModuleSymbol = "__module__";
export const AppModuleOptionsSymbol = "__appModuleOptionsSymbol__";


export function module(options?: IModuleDefinition): (fn: Function) => void {

    options = options || {};
    options.root = path.dirname(Util.callerPath());

    return function (fn: Function) {
        Reflect.defineMetadata(ModuleSymbol, options, fn);
    }
}