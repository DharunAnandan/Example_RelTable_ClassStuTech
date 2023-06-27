export class Numbers {
    public static toFixed(number: number | string, precision: number = 0): number {
        let pow = Math.pow(10, precision);
        return (Math.round((number as number) * pow) / pow);
    }

    public static random(min: number, max?: number, floating: boolean = false): number {

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

    public static randomInt(min: number, max?: number): number {

        if (max === undefined) {
            max = min;
            min = 0;
        }


        min = Math.ceil(Math.min(min, max));
        max = Math.floor(Math.max(min, max));
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static isValidRandom(num: number): boolean {
        return Numbers.random(1, num) == num
    }
}
