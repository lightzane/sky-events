import { Event } from '../data';
import { DateUtil } from './date.util';

export function sortEvents(events: Event[], leftOffset = +new Date()) {
  leftOffset = +DateUtil.resetTime(leftOffset);

  return (
    [...events]
      // Prioritize dates with near start and end
      .sort((a, b) => {
        if (a.start === b.start) {
          return a.end - b.end;
        }

        return a.start - b.start;
      })

      // Exclude past events
      .filter((e) => e.end >= leftOffset)
  );
}
