import { Event } from './events';
// @ts-ignore will be declared by the generated values
import { uuid } from '../shared/utils';

// These events are registered by the GitHub workflows
// Refer to branch: register_events/register_events.cjs

export const REGISTERED_EVENTS: Event[] = [
  {
    "name": "Go Happiness",
    "start": +new Date('07-OCT-2024'),
    "end": +new Date('07-OCT-2024'),
    "time": {
      "start": "12am PDT",
      "end": "11:59pm PDT"
    },
    "id": uuid()
  }
];
