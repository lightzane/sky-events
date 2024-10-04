import { Event } from './events';
// @ts-ignore will be declared by the generated values
import { uuid } from '../shared/utils';

// These events are registered by the GitHub workflows

export const REGISTERED_EVENTS: Event[] = [
  {
    "name": "Latest Event is here",
    "start": +new Date('04-OCT-2024'),
    "end": +new Date('04-OCT-2024'),
    "time": {
      "start": "12am PDT",
      "end": "11:59pm PDT"
    },
    "id": uuid()
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
    "name": "Another event is here",
    "start": +new Date('04-OCT-2024'),
    "end": +new Date('04-OCT-2024'),
    "id": uuid()
  }
];
