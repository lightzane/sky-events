import { Event } from './events';
// @ts-ignore will be declared by the generated values
import { uuid } from '../shared/utils';

// These events are registered by the GitHub workflows
// Refer to branch: register_events/register_events.cjs

export const REGISTERED_EVENTS: Event[] = [
  {
    "name": "Days of Mischief",
    "start": +new Date('21-OCT-2024'),
    "end": +new Date('10-NOV-2024'),
    "time": {
      "start": "12am PDT",
      "end": "11:59pm PDT"
    },
    "imageUrl": "https://d2duuy9yo5pldo.cloudfront.net/thatgamecompany/605d1079-2015-4d3d-8197-f57103f6e1e9.jpg",
    "id": uuid()
  },
  {
    "name": "⚜️ Season of Moomin",
    "start": +new Date('14-OCT-2024'),
    "end": +new Date('29-DEC-2024'),
    "time": {
      "start": "12am PDT",
      "end": "11:59pm PDT"
    },
    "imageUrl": "https://img2.storyblok.com/fit-in/0x1000/filters:format(webp)/f/108104/1920x1080/eef35b4e00/moomin24header.jpg",
    "id": uuid()
  }
];
