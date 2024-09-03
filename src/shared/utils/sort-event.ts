import { Event } from '../../data';
import { DateUtil } from './date.util';

export function sortEvents(events: Event[], leftOffset = +new Date()) {
  leftOffset = +DateUtil.resetTime(leftOffset);

  return (
    [...events]
      // Prioritize dates with near start and end
      .sort((a, b) => {
        if (+DateUtil.resetTime(a.start) === +DateUtil.resetTime(b.start)) {
          return +DateUtil.resetTime(a.end) - +DateUtil.resetTime(b.end);
        }

        return +DateUtil.resetTime(a.start) - +DateUtil.resetTime(b.start);
      })

      // Exclude past events
      .filter(
        (e) => +DateUtil.resetTime(e.end) >= +DateUtil.resetTime(leftOffset),
      )
  );
}
