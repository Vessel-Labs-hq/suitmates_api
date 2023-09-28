import { DateTime, DurationLike } from 'luxon';

export type TimeSpanType = {
  startOfTimeSpan: Date;
  endOfTimeSpan: Date;
  startOfPreviousTimeSpan: Date;
  endOfPreviousTimeSpan: Date;
};

export class DateHelper {
  static addToCurrent(duration: DurationLike): Date {
    const dt = DateTime.now();
    return dt.plus(duration).toJSDate();
  }

  static isAfterCurrent(date: Date): boolean {
    const d1 = DateTime.fromJSDate(date ?? new Date());
    const d2 = DateTime.now();
    return d2 > d1;
  }
}
