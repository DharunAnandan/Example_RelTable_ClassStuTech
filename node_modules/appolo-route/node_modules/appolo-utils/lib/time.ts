export class Time {

    public static Second = 1000;
    public static Minute = Time.Second * 60;
    public static Hour = Time.Minute * 60;
    public static Day = Time.Hour * 24;
    public static Week = Time.Day * 7;
    public static Month = Time.Week * 4;
    public static Year = Time.Day * 365.25;

    public static currentTimeInterval(interval: number): number {
        return Math.floor(Date.now() / interval) * interval
    }

    public static timeMili(time?: [number, number]): number {
        let t = process.hrtime(time);
        return (t[0] * 1e3) + (t[1] / 1e6);
    }

    public static timeMicro(time?: [number, number]): number {
        let t = process.hrtime(time);
        return t[0] * 1000000 + t[1] / 1000;
    }

    public static milisecPretty(ms: number): string {
        let msAbs = Math.abs(ms);
        if (msAbs >= Time.Day) {
            return Math.round(ms / Time.Day) + 'd';
        }
        if (msAbs >= Time.Hour) {
            return Math.round(ms / Time.Hour) + 'h';
        }
        if (msAbs >= Time.Minute) {
            return Math.round(ms / Time.Minute) + 'm';
        }
        if (msAbs >= Time.Second) {
            return Math.round(ms / Time.Second) + 's';
        }
        return ms + 'ms';
    }


}
