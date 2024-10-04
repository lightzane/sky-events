import { Event } from './events';
// @ts-ignore will be declared by the generated values
import { uuid } from '../shared/utils';

// These events are registered by the GitHub workflows
// Refer to branch: register_events/register_events.cjs

export const REGISTERED_EVENTS: Event[] = [
  {
    "name": "Test",
    "start": +new Date('06-OCT-2024'),
    "time": {
      "start": "12am PDT"
    },
    "id": uuid(),
    "end": +new Date('06-OCT-2024')
  }
];
