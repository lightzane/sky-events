import { TimeRegexUtil } from '../utils/time-regex.util';
import { TimeZoneUtil } from '../utils/time-zone.util';

export class TimeZoneValidator {
  /**
   * Validates the **timeZone** is registered.
   * @returns The **timeZone** registered
   * @see `timezone.util.ts`
   */
  static isTimeZoneRegistered(text: string): string | false {
    const match = TimeRegexUtil.timeZoneAbbr(text);

    if (
      match &&
      Object.values(TimeZoneUtil.registered()).includes(match.toUpperCase())
    ) {
      return match.toUpperCase();
    }

    return false;
  }

  static isTimeZoneUTC(text: string): string | false {
    const match = TimeRegexUtil.timeZoneAbbr(text);

    if (match && match.match(/UTC|GMT/i)) {
      return match.toUpperCase();
    }

    return false;
  }

  /** Leap year is divisible by 4, but not divisible by 100 unless divisible by 400 */
  static isLeapYear(year = new Date().getFullYear()): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /** Validates that the given date is valid */
  static isDateValid(month: string, day: number, year?: number): boolean {
    // Define a map of valid days for each month
    const validDays: { [key: string]: number } = {
      JAN: 31,
      FEB: this.isLeapYear(year) ? 29 : 28,
      MAR: 31,
      APR: 30,
      MAY: 31,
      JUN: 30,
      JUL: 31,
      AUG: 31,
      SEP: 30,
      OCT: 31,
      NOV: 30,
      DEC: 31,
    };

    // Check if the month is valid
    const maxDay = validDays[month.toUpperCase()];

    if (maxDay) {
      // Check if the day is within the valid range
      return day >= 1 && day <= maxDay;
    }

    return false; // Month is not valid
  }

  /** Returns true, when **am** or **pm** is detected */
  static is12HourFormat(text: string): string | false {
    if (!text) {
      return false;
    }

    const regex = /am|pm/i;
    const matches = text.match(regex);

    if (!matches) {
      return false;
    }

    return matches[0];
  }

  /** Validate if the hour within the time is valid */
  static isHourValid(text: string): boolean {
    const time = TimeRegexUtil.getTime(text);

    if (time) {
      const is12Hour = this.is12HourFormat(time);

      // for 24-hour format
      let min = 0;
      let max = 24;

      // adjust to 12-hour format
      if (is12Hour) {
        max = 12;
      }

      const hour = TimeRegexUtil.getHour(time);

      if (hour) {
        if (hour > max || hour < min) {
          return false;
        }
      }

      const minute = TimeRegexUtil.getMinute(time);

      if (minute) {
        if (minute >= 60) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /** Validates the hour and minutes within the time text */
  static isTimeValid(text: string): boolean {
    if (!this.isHourValid(text)) {
      return false;
    }

    return true;
  }

  /**
   * Validates the text with the correct timezone formatting
   * @returns The same **text** if valid. Else, returns the validation message
   *
   * ### Error pattern:
   *
   * `/not supported|invalid/i`
   */
  static validate(text: string, year: number): string {
    const registered = this.isTimeZoneRegistered(text);
    const UTCformat = this.isTimeZoneUTC(text);

    // ? Is valid timezone
    if (
      (!registered && !UTCformat) ||
      (UTCformat && !UTCformat.match(/UTC|GMT/i))
    ) {
      return `Timezone Not Supported`;
    }

    const hasDate = TimeRegexUtil.monthDay(text);

    // ? Is date valid
    if (hasDate) {
      const [month, day] = hasDate.split(' ');

      const valid = this.isDateValid(month, +day, year);

      if (!valid) {
        return `Invalid date`;
      }
    }

    // ? Is time valid
    if (!this.isTimeValid(text)) {
      return `Invalid time`;
    }

    /** Valid timezones */
    const vtz = TimeZoneUtil.registeredList();

    return text.replace(new RegExp(`${vtz}`, 'i'), (m) => m.toUpperCase());
  }
}
