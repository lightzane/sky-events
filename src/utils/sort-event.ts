import { Event } from '../data';

export function sortEvents(events: Event[]) {
  return [...events].sort((a, b) => {
    if (a.start === b.start) {
      return a.end - b.end;
    }

    return a.start - b.start;
  });
}
