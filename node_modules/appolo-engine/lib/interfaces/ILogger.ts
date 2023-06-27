type LoggerFn = (msg: string, ...args: any[]) => void;

export interface ILogger {
    error: LoggerFn
    info: LoggerFn
    debug: LoggerFn
    warn: LoggerFn
}