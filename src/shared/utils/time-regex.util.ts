import { DateUtil } from './date.util';

export class TimeRegexUtil {
  static months = [...DateUtil.months];

  /** All months (3-letter word) separated by `|` */
  static M = this.months.join('|');

  /**
   * Returns **FIRST MATCH** of the following like matches:
   *
   * ```txt
   * Dec 05
   * Dec 5
   * ```
   */
  static monthDay(text: string): string | null {
    const regex = new RegExp(`\\b(?:${this.M}) \\d{1,2}\\b`, 'i');
    const matches = text.match(regex);

    if (!matches) {
      return null;
    }

    return matches[0];
  }

  /**
   * Returns **FIRST MATCH** of the following like matches:
   *
   * ```txt
   * PHT
   * EST
   * IST
   * CST
   * UTC+7
   * UTC-8
   * UTC+08:00
   * UTC-08
   * UTC+9:30
   * UTC-09:30
   * ```
   */
  static timeZoneAbbr(text: string): string | null {
    const regex = /\b \w{3}(?:[\-|\+]\d{1,2}(?::\d{2})?)?\b/i;
    const matches = text.match(regex);

    if (!matches) {
      return null;
    }

    return matches[0].trim();
  }

  /**
   * Returns **FIRST_MATCH** of the following like matches:
   *
   * ```txt
   * 01:00
   * 1:00
   * 13:00
   * 1 PM
   * 1PM
   * ```
   */
  static getTime(text: string): string | null {
    /** (?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2},)? ?\d{1,2}(?::\d{2})? ?(?:am|pm)? */
    const regex = new RegExp(
      `(?:(?:${this.M}) \\d{1,2},)? ?\\d{1,2}(?::\\d{2})? ?(?:am|pm)?`,
      'i',
    );
    const matches = text.match(regex);

    if (!matches) {
      return null;
    }

    return matches[0];
  }

  /** Gets the hour (**01** or **1**) within the time */
  static getHour(time: string): number | undefined {
    /**
     * (?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2},)? ?(\d{1,2})
     */
    const regex = new RegExp(`(?:(?:${this.M}) \\d{1,2},)? ?(\\d{1,2})`, 'i');
    const matches = time.match(regex);

    if (!matches) {
      return;
    }

    if (!matches[1]) {
      return;
    }

    return parseInt(matches[1]);
  }

  /** Gets the minute (**50** or **05**) within the time */
  static getMinute(time: string): number | undefined {
    const regex = /:(\d{2})/;
    const matches = regex.exec(time);

    if (!matches) {
      return;
    }

    if (!matches[1]) {
      return;
    }

    return parseInt(matches[1]);
  }
}
