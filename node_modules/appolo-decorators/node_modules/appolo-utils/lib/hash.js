"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strings_1 = require("./strings");
const crypto_1 = require("crypto");
class Hash {
    static hashPlainObject(obj, algorithm = 'sha1', encoding = 'hex') {
        return crypto_1.createHash(algorithm).update(strings_1.Strings.stringifyObjectValues(obj)).digest(encoding);
    }
    static hashCode(s, prefix = "_") {
        let h = 0, l = s.length, i = 0;
        if (l > 0)
            while (i < l)
                h = (h << 5) - h + s.charCodeAt(i++) | 0;
        return prefix + h;
    }
}
exports.Hash = Hash;
//# sourceMappingURL=hash.js.map