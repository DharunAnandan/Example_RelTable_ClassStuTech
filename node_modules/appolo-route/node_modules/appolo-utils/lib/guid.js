"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Guid {
    static shortGuid() {
        return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
    }
    static s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    ;
    static guid() {
        return Guid.s4() + Guid.s4() + '-' + Guid.s4() + '-' + Guid.s4() + '-' + Guid.s4() + '-' + Guid.s4() + Guid.s4() + Guid.s4();
    }
}
exports.Guid = Guid;
//# sourceMappingURL=guid.js.map