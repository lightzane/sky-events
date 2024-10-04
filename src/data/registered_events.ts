import { Event } from './events';
// @ts-ignore will be declared by the generated values
import { uuid } from '../shared/utils';

// These events are registered by the GitHub workflows
// Refer to branch: register_events/register_events.cjs

export const REGISTERED_EVENTS: Event[] = [
  {
    "name": "Clarity",
    "start": +new Date('05-OCT-2024'),
    "id": uuid(),
    "end": +new Date('05-OCT-2024')
  },
  {
    "name": "Go go go",
    "start": +new Date('09-OCT-2024'),
    "id": uuid(),
    "end": +new Date('09-OCT-2024')
  },
  {
    "name": "Sample Event",
    "start": +new Date('04-OCT-2024'),
    "end": +new Date('04-OCT-2024'),
    "time": {
      "start": "12am PDT",
      "end": "11:59pm PDT"
    },
    "id": uuid()
  },
  {
    "name": "Another Event",
    "start": +new Date('08-OCT-2024'),
    "id": uuid(),
    "end": +new Date('08-OCT-2024')
  }
];
