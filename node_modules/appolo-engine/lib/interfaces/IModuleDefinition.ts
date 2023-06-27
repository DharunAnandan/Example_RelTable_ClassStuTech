import {Module} from "../modules/module";
import {Define} from "appolo-inject/index";

export interface IClass {
    new(...args: any[]): any
}

export type ModuleTypes = (IClass | { id: string, type: IClass | string })[]

export type IPlugin = (fn: Function) => void;

export interface IModuleDefinition {
    options?: any
    modules?: (typeof Module | Module)[]
    exports?: ModuleTypes
    imports?: ModuleTypes
    root?: string
    immediate?: boolean
    parallel?: boolean

}

export interface IModuleOptions {
    immediate?: boolean
    parallel?: boolean
}

export interface IExported {
    fn: Function,
    path: string,
    define: Define
}

