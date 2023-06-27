import CallSite = NodeJS.CallSite;

export class Errors {
    public static stack(): CallSite[] {

        let pst = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
            Error.prepareStackTrace = pst;
            return stack;
        };

        let stack = (new Error()).stack;

        return stack as any;
    }
}
