import {IClass} from "../interfaces/IModuleDefinition";
import {Util} from "../util/util";
import {App} from "../app";

export const BootstrapSymbol = "__bootstrap__";


export function bootstrap(): (fn: Function) => void {
    return function (fn: Function) {

        Reflect.defineMetadata(BootstrapSymbol, true, fn);

    }
}



