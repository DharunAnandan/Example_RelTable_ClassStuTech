"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleLoader = void 0;
const module_1 = require("./module");
const util_1 = require("../util/util");
const events_1 = require("../interfaces/events");
const decorators_1 = require("appolo-inject/lib/decorators");
const index_1 = require("../../index");
const module_2 = require("../decoretors/module");
const appolo_utils_1 = require("appolo-utils");
class ModuleLoader {
    constructor(_module, _parenInjector) {
        this._module = _module;
        this._parenInjector = _parenInjector;
        this._moduleDefinition = {};
        this._moduleDefinition = Reflect.getMetadata(module_2.ModuleSymbol, _module.constructor);
        _module.moduleOptions = appolo_utils_1.Objects.defaults({}, _module.moduleOptions, {
            immediate: this._moduleDefinition.immediate,
            parallel: this._moduleDefinition.parallel
        }, { immediate: false, parallel: false });
    }
    get module() {
        return this._module;
    }
    preInitialize() {
        if (!this._moduleDefinition) {
            return;
        }
        this._setDefinitions();
        this._module.app = this._createApp(this._parenInjector, this._moduleDefinition);
        this._module.moduleOptions = appolo_utils_1.Objects.defaults({}, this._module.moduleOptions || {}, this._module.defaults);
        this._module.app.injector.addObject("moduleOptions", this._module.moduleOptions, true);
        this._handleFileExport();
    }
    async initialize() {
        try {
            await this._module.beforeInitialize();
            await this._loadInnerModules(this._module.app, this._moduleDefinition);
            this._handleExports(this._module.app);
            this._handleImports(this._module.app);
            await this._module.beforeLaunch();
            this._fireClassExportEvents();
            await this._module.app.launch();
            await this._module.afterInitialize();
        }
        catch (e) {
            util_1.Util.logger(this._parenInjector).error(`failed to initialize module ${this._module.constructor.name}`, { e: e.stack });
            throw e;
        }
    }
    _fireClassExportEvents() {
        if (!this._module.app.hasListener(events_1.Events.ClassExport) && !this._module.app.hasListener(events_1.Events.InjectRegister)) {
            return;
        }
        this._module.app.parent.exported.forEach(item => {
            if (Reflect.hasMetadata(decorators_1.InjectDefineSymbol, item.fn)) {
                this._module.app.fireEvent(events_1.Events.InjectRegister, item.fn, item.path);
            }
            this._module.app.fireEvent(events_1.Events.ClassExport, item.fn, item.path);
        });
    }
    _setDefinitions() {
        if (this._moduleDefinition.options) {
            Object.assign(this._module.moduleOptions, this._moduleDefinition.options);
        }
    }
    _createApp(parent, moduleDefinition) {
        let rootEnv = parent.getObject("env");
        let app = index_1.createApp({
            root: moduleDefinition.root,
            environment: rootEnv.type
        });
        app.injector.addObject("rootEnv", rootEnv, true);
        app.injector.addObject("env", Object.assign({}, rootEnv, app.env), true);
        Reflect.defineMetadata(module_2.AppModuleOptionsSymbol, this._module.moduleOptions, app);
        app.injector.parent = parent;
        app.parent = parent.get('app');
        return app;
    }
    async _loadInnerModules(app, moduleDefinition) {
        if (!moduleDefinition.modules) {
            return;
        }
        for (let module of moduleDefinition.modules) {
            let moduleInstance = module instanceof module_1.Module ? module : new module;
            let moduleLoader = new ModuleLoader(moduleInstance, app.injector);
            moduleLoader.preInitialize();
            await moduleLoader.initialize();
        }
    }
    _handleExports(app) {
        let moduleExports = [].concat(this._module.exports);
        if (this._moduleDefinition.exports && this._moduleDefinition.exports.length) {
            moduleExports.push(...this._moduleDefinition.exports);
        }
        moduleExports.forEach(item => {
            let id, type;
            if (typeof item == "function") {
                id = util_1.Util.getClassNameOrId(item);
                type = item;
                app.injector.parent.addDefinition(id, { injector: app.injector });
            }
            else {
                id = item.id;
                type = item.type;
                app.injector.parent.addDefinition(item.id, {
                    injector: app.injector,
                    refName: util_1.Util.getClassNameOrId(item.type)
                });
            }
            this._module.app.fireEvent(events_1.Events.ModuleExport, type, id);
            this._module.app.parent && (this._module.app.parent.fireEvent(events_1.Events.ModuleExport, type, id));
        });
    }
    _handleFileExport() {
        this._module.fileExports.forEach(fn => {
            this._module.app.parent.addExported({ path: "", fn, define: util_1.Util.getClassDefinition(fn) });
        });
    }
    _handleImports(app) {
        let moduleImports = [].concat(this._module.imports);
        if (this._moduleDefinition.imports && this._moduleDefinition.imports.length) {
            moduleImports.push(...this._moduleDefinition.imports);
        }
        (moduleImports || []).forEach(item => {
            if (typeof item == "function") {
                return;
            }
            app.injector.addDefinition(util_1.Util.getClassNameOrId(item.type), {
                injector: app.injector.parent,
                refName: item.id
            });
        });
    }
}
exports.ModuleLoader = ModuleLoader;
//# sourceMappingURL=moduleLoader.js.map