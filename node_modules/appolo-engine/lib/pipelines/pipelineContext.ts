import {IPipelineContext} from "./IPipeline";

export class PipelineContext<T = any> {

    constructor(private _context: IPipelineContext, private _index: number, private _metaData: any, private _options: any) {

    }

    public get metaData(): T {
        return this._metaData;
    }

    public get options(): any {
        return this._options;
    }

    public get index(): number {
        return this._index;
    }

    public get arguments(): IArguments {
        return this._context.args;
    }

    public get instance(): any {
        return this._context.instance;
    }

    public originFn(): Function {
        return this._context.instance[this._context.action]["__PIPELINE__"]
    }

    public get type(): any {
        return this._context.type;
    }

    public get action(): string {
        return this._context.action;
    }

    public get argumentsTypes(): any[] {
        return this._context.argsTypes || [];
    }

    public get isArgument(): boolean {
        return !isNaN(this._index);
    }

    public setArgumentAt(index: number, value: any) {
        this.arguments[index] = value;
    }

    public getArgumentAt(index: number): any {
        return this.arguments[index]
    }

    public get value(): any {
        if (this.isArgument) {
            return this.arguments[this._index];
        }
    }

    public get values(): { index: number, value: any, type: any }[] {
        if (this.isArgument) {
            return [{
                index: this._index,
                value: this.getArgumentAt(this._index),
                type: this.argumentsTypes[this._index]
            }]
        }

        return Array.from(this.arguments).map((value, index) => ({index, value, type: this.argumentsTypes[index]}))
    }
}
