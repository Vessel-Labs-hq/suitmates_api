import { DurationLike } from 'luxon';
export type TimeSpanType = {
    startOfTimeSpan: Date;
    endOfTimeSpan: Date;
    startOfPreviousTimeSpan: Date;
    endOfPreviousTimeSpan: Date;
};
export declare class DateHelper {
    static addToCurrent(duration: DurationLike): Date;
    static isAfterCurrent(date: Date): boolean;
}
