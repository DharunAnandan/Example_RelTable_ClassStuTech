"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Numbers {
    static toFixed(number, precision = 0) {
        let pow = Math.pow(10, precision);
        return (Math.round(number * pow) / pow);
    }
    static random(min, max, floating = false) {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        let isInt = !floating && Number.isInteger(min) && Number.isInteger(min);
        if (isInt) {
            return Numbers.randomInt(min, max);
        }
        min = Math.min(min, max);
        max = Math.max(max, max);
        return (Math.random() * (max - min + 1)) + min;
    }
    static randomInt(min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        min = Math.ceil(Math.min(min, max));
        max = Math.floor(Math.max(min, max));
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static isValidRandom(num) {
        return Numbers.random(1, num) == num;
    }
}
exports.Numbers = Numbers;
//# sourceMappingURL=numbers.js.map