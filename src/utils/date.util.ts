export class DateUtil {
  static getCurrentWeek(): Date[] {
    const today = new Date();
    const dates = [];

    for (let i = -1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  }

  static format(date: Date | number): string {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();

    return `${month}/${day}`;
  }

  static getDayName(date: Date | number): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }

  static isToday(date: Date | number): boolean {
    const d = new Date(date);
    // Get today's date
    const today = new Date();

    // Reset hours, minutes, seconds, and milliseconds for comparison
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const startOfDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    // Compare the two dates
    return startOfToday.getTime() === startOfDate.getTime();
  }

  static isEqual(a: Date | number, b: Date | number): boolean {
    const date1 = DateUtil.resetTime(a);
    const date2 = DateUtil.resetTime(b);

    // Compare the two dates
    return date1.getTime() === date2.getTime();
  }

  static getWeekIndex(dates: Date[], startDate: Date | number): number {
    let index = -1;
    const start = +new Date(startDate);

    index = dates.findIndex((d) => DateUtil.isEqual(d, start));

    if (index !== -1) {
      return index;
    }

    return index;
  }

  static resetTime(date: Date | number): Date {
    date = new Date(date);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return date;
  }

  static getTotalDays(date1: Date | number, date2: Date | number): number {
    // Reset hours, minutes, seconds, and milliseconds for comparison
    date1 = DateUtil.resetTime(date1);
    date2 = DateUtil.resetTime(date2);

    // Ensure date1 is earlier than date2 for positive difference
    const earlierDate = date1 < date2 ? date1 : date2;
    const laterDate = date1 < date2 ? date2 : date1;

    // Calculate the difference in time (milliseconds)
    const timeDifference = laterDate.getTime() - earlierDate.getTime();

    // Convert milliseconds to days
    const millisecondsInDay = 1000 * 60 * 60 * 24;

    return Math.floor(timeDifference / millisecondsInDay);
  }

  static isExpired(
    startDate: Date | number,
    endDate: Date | number,
    leftOffset = +new Date(),
  ): boolean {
    startDate = +DateUtil.resetTime(startDate);
    endDate = +DateUtil.resetTime(endDate);
    leftOffset = +DateUtil.resetTime(leftOffset); // The first visible date within the active view or date range

    if (leftOffset > startDate && leftOffset > endDate) {
      return true;
    }

    return false;
  }

  static isFutureOutsideRange(
    startDate: Date | number,
    rightOffset: Date | number,
  ): boolean {
    startDate = +new Date(startDate);
    rightOffset = +new Date(rightOffset);

    if (startDate > rightOffset) {
      return true;
    }

    return false;
  }
}
