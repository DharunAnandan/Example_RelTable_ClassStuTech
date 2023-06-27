"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleManager = void 0;
const appolo_utils_1 = require("appolo-utils");
const path = require("path");
const util_1 = require("../util/util");
const module_1 = require("./module");
const module_2 = require("../decoretors/module");
const app_1 = require("../app");
const events_1 = require("../interfaces/events");
const moduleLoader_1 = require("./moduleLoader");
class ModuleManager {
    constructor(_options, _injector) {
        this._options = _options;
        this._injector = _injector;
        this._modules = [];
    }
    async loadDynamicModules() {
        for (let i = 0, len = this._modules.length; i < len; i++) {
            this._modules[i].preInitialize();
        }
        await util_1.Util.runRegroupByParallel(this._modules, loader => loader.module.moduleOptions.parallel, module => this._loadModule(module));
    }
    async _loadModule(module) {
        this._injector.get(app_1.App).fireEvent(events_1.Events.BeforeModuleInit, module);
        await module.initialize();
        this._injector.get(app_1.App).fireEvent(events_1.Events.ModuleInit, module);
    }
    async _registerModule(moduleFn, isParallel) {
        let module = module_1.Module.isPrototypeOf(moduleFn) ? new moduleFn() : moduleFn;
        module.moduleOptions.parallel = isParallel;
        let loader = new moduleLoader_1.ModuleLoader(module, this._injector);
        if (module.moduleOptions.immediate) {
            loader.preInitialize();
            await this._loadModule(loader);
        }
        else {
            this._modules.push(loader);
        }
    }
    async load(modules) {
        let [dynamicModules, staticModules] = appolo_utils_1.Arrays.partition(modules, module => Reflect.hasMetadata(module_2.ModuleSymbol, module) || Reflect.hasMetadata(module_2.ModuleSymbol, module.constructor));
        await appolo_utils_1.Promises.map(dynamicModules, item => this._registerModule(item, dynamicModules.length > 1));
        await appolo_utils_1.Promises.map(staticModules, item => this._loadStaticModule(item));
    }
    _loadStaticModule(moduleFn) {
        //remove the callback arg
        let args = util_1.Util.getFunctionArgs(moduleFn), lastArg = args[args.length - 1], isCallback = false;
        if (['callback', 'next', 'fn', 'func'].indexOf(lastArg) > -1) {
            args = args.slice(0, -1);
            isCallback = true;
        }
        let dependencies = args.map((arg) => this._injector.getObject(arg));
        if (isCallback) {
            return appolo_utils_1.Promises.fromCallback((callback) => moduleFn.apply(moduleFn, dependencies.concat([callback])));
        }
        return Promise.resolve().then(() => moduleFn.apply(moduleFn, dependencies));
    }
    async loadStaticModules() {
        let allPath = path.join(this._options.root, 'config/modules/all.js'), environmentPath = path.join(this._options.root, 'config/modules/', this._options.environment + '.js');
        await util_1.Util.loadPathWithArgs([allPath, environmentPath], this._injector);
    }
}
exports.ModuleManager = ModuleManager;
//# sourceMappingURL=modules.js.map