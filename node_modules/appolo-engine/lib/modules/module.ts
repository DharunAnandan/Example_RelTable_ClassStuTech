import {Injector} from "appolo-inject";
import {createApp, IApp} from "../../index"
import {Util} from "../util/util";
import {IClass, IModuleDefinition, IModuleOptions, ModuleTypes} from "../interfaces/IModuleDefinition";


export class Module<T = any> {

    protected _exports: ModuleTypes = [];
    protected _fileExports: IClass[] = [];
    protected _imports: ModuleTypes = [];
    protected _moduleOptions: T;
    protected _app: IApp;

    constructor(options: T & IModuleOptions = {} as T) {
        this._moduleOptions = options;
    }

    protected readonly Defaults: Partial<T> = {};

    public get defaults(): Partial<T> {
        return this.Defaults
    }


    public get app(): IApp {
        return this._app;
    }

    public set app(value: IApp) {
        this._app = value;
    }

    public get parent(): IApp {
        return this._app.parent;
    }

    public get root(): IApp {
        return this._app.root
    }

    public get rootParent(): IApp {

        return this._app.root
    }

    public get exports(): ModuleTypes {
        return this._exports;
    }

    public set exports(value: (IClass | { id: string; type: IClass | string })[]) {
        this._exports = value;
    }

    public get fileExports(): IClass[] {
        return this._fileExports;
    }

    public set fileExports(value: IClass[]) {
        this._fileExports = value;
    }

    public set imports(value: (IClass | { id: string; type: IClass | string })[]) {
        this._imports = value;
    }

    public get imports(): ModuleTypes {
        return this._imports;
    }

    public get moduleOptions(): T {
        return this._moduleOptions;
    }

    public set moduleOptions(value: T) {
        this._moduleOptions = value;
    }

    public beforeInitialize() {

    }

    public beforeLaunch() {

    }

    public afterInitialize() {

    }

}
