import { DateTime } from 'luxon';
import { TimeZoneValidator } from '../validators';
import { DateUtil } from './date.util';
import { TimeRegexUtil } from './time-regex.util';

export class TimeZoneUtil {
  static registered(): Record<string, string> {
    return {
      'Asia/Manila': 'PHT', // Philippine Time
      'Asia/Kolkata': 'IST', // Indian Standard Time
      'America/New_York': 'EST', // Eastern Standard Time
      'America/Chicago': 'CST', // Central Standard Time
      'America/Los_Angeles': 'PDT', // Pacific Daylight Time
    };
  }

  static registeredList() {
    return Array.from(
      new Set(['UTC', 'GMT', ...Object.values(this.registered())]), // SET of unique items
    ).join('|');
  }

  /**
   * Identify the abbreviation of the given **timeZone**
   * @example
   *
   * ```ts
   * TimezoneUtil.getShort('Asia/Manila') // PHT
   * ```
   */
  static getShort(timeZone: string): string {
    const exist = this.registered()[timeZone];

    if (!exist) {
      return 'Not Registered, Please contact developer';
    }

    return exist;
  }

  /**
   * Identify the timeZone of the given **abbreviation**
   * @example
   *
   * ```ts
   * TimezoneUtil.getLong('PHT') // Asia/Manila
   * ```
   */
  static getLong(timezoneAbbreviations: string): string {
    const exist = Object.keys(this.registered()).find(
      (timeZone) =>
        this.registered()[timeZone] === timezoneAbbreviations.toUpperCase(),
    );

    if (!exist) {
      return 'Not Registered, Please contact developer';
    }

    return exist;
  }

  /**
   * Converts a datetime to local time.
   * @usage #### Assume local time is UTC+8
   *
   * ```ts
   * const dateTimeZone = '12am PDT';
   * const base = new Date()
   *
   * const output = TimeZoneUtil.getLocalTime(dateTimeZone, base)
   *
   * console.log(output) // => 3:00 PM
   * ```
   *
   * @param dateTimeZone The time to be converted to local (e.g. `12am PDT`)
   * @param base The default date to be based on. (e.g. `new Date()`)
   * @returns Local time string
   */
  static getLocalTime(
    dateTimeZone: string,
    base: Date,
    asISOString = false,
  ): string {
    const monthDay = TimeRegexUtil.monthDay(dateTimeZone);

    let [givenMonthName, givenDate] = monthDay?.split(' ') ?? [];

    let givenMonth = -1;

    if (givenMonthName) {
      const _m = givenMonthName?.slice(1);

      givenMonth = TimeRegexUtil.months.indexOf(
        givenMonthName.charAt(0).toUpperCase().concat(_m),
      );
    }

    if (givenMonth === -1) {
      givenMonth = base.getUTCMonth();
    }

    const validated = TimeZoneValidator.validate(
      dateTimeZone,
      base.getUTCFullYear(),
    );

    const error = validated.match(/not supported|invalid/i) ? 'error' : '';

    if (error) {
      throw new Error(validated);
    }

    const timeZoneAbbr = TimeRegexUtil.timeZoneAbbr(dateTimeZone);

    // * Set Time via input
    let hour = TimeRegexUtil.getHour(dateTimeZone);
    const minute = TimeRegexUtil.getMinute(dateTimeZone);

    const isTimeZoneUTC = TimeZoneValidator.isTimeZoneUTC(dateTimeZone);
    const hour12 = TimeZoneValidator.is12HourFormat(dateTimeZone);

    if (hour12 && hour) {
      if (hour === 12) {
        hour -= 12;
      }

      if (hour12.toLowerCase() === 'pm') {
        hour += 12;
      }
    }

    let foreignDate: DateTime;

    if (isTimeZoneUTC && timeZoneAbbr) {
      foreignDate = DateTime.fromObject(
        {
          year: base.getUTCFullYear(),
          month: givenMonth + 1,
          day: parseInt(givenDate) || base.getDate(),
          hour,
          minute,
        },
        {
          zone: timeZoneAbbr.replace(/gmt/i, 'utc'),
        },
      );
    } else if (timeZoneAbbr) {
      const timeZone = TimeZoneUtil.getLong(timeZoneAbbr);

      foreignDate = DateTime.fromObject(
        {
          year: base.getUTCFullYear(),
          month: givenMonth + 1,
          day: parseInt(givenDate) || base.getDate(),
          hour,
          minute,
        },
        {
          zone: timeZone,
        },
      );
    }

    let output = '';

    // @ts-ignore
    if (foreignDate) {
      const localDateTime = foreignDate.toJSDate();

      if (asISOString) {
        return localDateTime.toISOString();
      }

      const localDate = DateUtil.format(localDateTime);
      const localTime = DateUtil.formatTime(localDateTime).trim();

      if (
        !DateUtil.isSameDay(localDateTime) || // not today
        foreignDate.day !== localDateTime.getDate() // timezone not same day
      ) {
        output = localDate;
      } else {
        output = localTime;
      }

      // output += ` ${localTime}`;

      output = output.trim();

      // remove starting zero
      output = output.replace(/\b(0)\d:\b/, (match, zero) =>
        match.replace(zero, ''),
      );
    }

    return output;
  }
}
