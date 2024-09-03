export class DateUtil {
  static readonly locales: Intl.LocalesArgument = 'en-US';

  static readonly months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  /**
   * Formats the date into human-friendly
   * @example 'Thu, August 3, 2023 at 8:12 PM'
   *
   * Omits the year if it is the same year with current year.
   */
  static format(date: Date | number): string {
    date = new Date(date);

    const outputWithYear = date.toLocaleString(DateUtil.locales, {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    const outputWithoutYear = date.toLocaleString(DateUtil.locales, {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    if (date.getFullYear() === new Date().getFullYear()) {
      return outputWithoutYear;
    }

    return outputWithYear;
  }

  static formatTime(date: Date | number): string {
    date = new Date(date);

    return date
      .toLocaleDateString(DateUtil.locales, {
        hour: '2-digit',
        minute: '2-digit',
      })
      .split(',')[1];
  }

  /**
   * Determines whether the given dates are exactly the same day
   * @param date1 The specified date to compare
   * @param date2 The other date to compare with. (**Defaults to current date**)
   * @returns **true** when both the is exactly the same day.
   */
  static isSameDay(date1: Date, date2 = new Date()): boolean {
    return (
      new Date(date1).setHours(0, 0, 0, 0) ===
      new Date(date2).setHours(0, 0, 0, 0)
    );
  }

  // * ========================================================================================
  // * ========================================================================================
  // * ========================================================================================

  /** @param numberOfDays Default: `7` (1 week) */
  static getSpanDays(numberOfDays = 7, currentDate?: Date): Date[] {
    const today = currentDate || new Date();
    const dates = [];

    // Days "span" always start with "yesterday"
    // Yesterday = -1
    // Today = 0
    // Tomorrow = 1
    const span = -1 + numberOfDays;

    for (let i = -1; i < span; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  }

  static getCurrentWeek(): Date[] {
    return this.getSpanDays();
  }

  /** returns `8/28` format */
  static formatDateShort(date: Date | number): string {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();

    return `${month}/${day}`;
  }

  /** returns `2024-08-28` format */
  static formatDateLong(date: Date | number): string {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  static getDayName(date: Date | number): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }

  static isToday(date: Date | number): boolean {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Compare the two dates
    return date.getTime() === today.getTime();
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
