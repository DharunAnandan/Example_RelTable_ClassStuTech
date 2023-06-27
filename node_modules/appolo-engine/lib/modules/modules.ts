"use strict";
import {Promises, Arrays} from 'appolo-utils';
import   path = require('path');
import {Util} from "../util/util";
import {Injector} from "appolo-inject";
import {Module} from "./module";
import {IOptions} from "../interfaces/IOptions";
import {IPlugin} from "../interfaces/IModuleDefinition";
import {ModuleSymbol} from "../decoretors/module";
import {App} from "../app";
import {Events} from "../interfaces/events";
import {ModuleLoader} from "./moduleLoader";

export interface IModuleCrt {
    new(...args: any[]): Module
}

export type ModuleFunction = ((...args: any[]) => void | Promise<any>)

export type ModuleFn = ModuleFunction | IModuleCrt | Module<any>

export class ModuleManager {
    private readonly _modules: ModuleLoader[];

    constructor(private _options: IOptions, private _injector: Injector) {
        this._modules = [];
    }

    public async loadDynamicModules() {

        for (let i = 0, len = this._modules.length; i < len; i++) {
            this._modules[i].preInitialize();
        }

        await Util.runRegroupByParallel<ModuleLoader>(this._modules, loader => loader.module.moduleOptions.parallel, module => this._loadModule(module));
    }

    private async _loadModule(module: ModuleLoader) {
        this._injector.get<App>(App).fireEvent(Events.BeforeModuleInit, module);

        await module.initialize();

        this._injector.get<App>(App).fireEvent(Events.ModuleInit, module);

    }

    private async _registerModule(moduleFn: typeof Module | Module, isParallel: boolean) {


        let module = Module.isPrototypeOf(moduleFn) ? new (moduleFn as typeof Module)() : moduleFn as Module;

        module.moduleOptions.parallel = isParallel;

        let loader = new ModuleLoader(module, this._injector);

        if (module.moduleOptions.immediate) {
            loader.preInitialize();
            await this._loadModule(loader);
        } else {
            this._modules.push(loader);
        }
    }


    public async load(modules: ModuleFn[]): Promise<any> {

        let [dynamicModules, staticModules] = Arrays.partition(modules, module => Reflect.hasMetadata(ModuleSymbol, module) || Reflect.hasMetadata(ModuleSymbol, module.constructor))

        await Promises.map(dynamicModules, item => this._registerModule(item as typeof Module | Module, dynamicModules.length > 1));


        await Promises.map(staticModules, item => this._loadStaticModule(item as ModuleFunction));


    }

    private _loadStaticModule(moduleFn: ModuleFunction): PromiseLike<any> {
        //remove the callback arg
        let args = Util.getFunctionArgs(moduleFn as ModuleFunction),
            lastArg = args[args.length-1],
            isCallback = false;

        if (['callback', 'next', 'fn', 'func'].indexOf(lastArg) > -1) {
            args = args.slice(0,-1);
            isCallback = true;
        }

        let dependencies = args.map((arg: string) => this._injector.getObject(arg));

        if (isCallback) {
            return Promises.fromCallback((callback) => (moduleFn as ModuleFunction).apply(moduleFn, dependencies.concat([callback])));
        }

        return Promise.resolve().then(() => (moduleFn as ModuleFunction).apply(moduleFn, dependencies))
    }

    public async loadStaticModules(): Promise<void> {


        let allPath = path.join(this._options.root, 'config/modules/all.js'),
            environmentPath = path.join(this._options.root, 'config/modules/', this._options.environment + '.js');


        await Util.loadPathWithArgs([allPath, environmentPath], this._injector)
    }


}


