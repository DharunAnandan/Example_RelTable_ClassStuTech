import {IEnv} from "./IEnv";
import {Define, Injector} from "appolo-inject/index";
import {IEventDispatcher} from "appolo-event-dispatcher/";
import {IExported} from "./IModuleDefinition";

export interface IApp extends IEventDispatcher {
    env: IEnv
    injector: Injector

    reset()

    parent: IApp
    root: IApp
    children: IApp[]

    launch(): Promise<IApp>

    exported: IExported[]

    exportedRoot: IExported[]

}
