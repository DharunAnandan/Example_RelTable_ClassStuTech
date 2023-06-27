export class Strings {
    public static stringifyObjectValues(obj: { [index: string]: string | boolean | number }): string {
        let s = '';
        for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
                s = s + obj[k];
            }

        }
        return s;
    }

    public static isString(str: any): str is String {
        return (typeof str === 'string' || str instanceof String);
    }

    public static removeNewLine(str: string): string {
        return str.replace(/(\r\n|\n|\r)/gm, "");
    }

    public static replaceFormat(str: string, data: any): string {
        return str.replace(/\$\{([\w\.\_]*)\}/gm, (m, key) => data.hasOwnProperty(key) ? ((!data[key] && data[key] !== false) ? "" : data[key]) : m)
    }

    public static removeNonAsciiChars(fromString: string): string {
        if (typeof (fromString) === "string") {
            return fromString.replace(/[^\x00-\x7F]/g, "").replace(/\s\s+/g, ' ');
        }

        return fromString;
    }

    public static tryDecodeURIComponent(str): string {
        try {
            return decodeURIComponent(str || "");
        } catch (e) {
            return str || ""
        }
    }
}
