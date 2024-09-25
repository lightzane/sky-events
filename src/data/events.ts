import { uuid } from '../shared/utils';

import imgDoubleLight from '../assets/Double-candle-event-September-2024.webp';
import { Shards } from './shards';
import { DateTime } from 'luxon';

export type Event = {
  id: string;
  name: string;
  start: number;
  end: number;
  tags?: string[];
  time?: Time;
  imageUrl?: string;
};

type Time = {
  /**
   * Valid value formats:
   * - `10pm`
   * - `22:00`
   * - `12am PDT`
   * - `00:00 PDT`
   *
   * Default: `12am` */
  start?: string;

  /** Default: `11:59pm` */
  end?: string;
};

/** `12am PDT >> 11:59pm PDT` */
const defaultTime = {
  start: '12am PDT',
  end: '11:59pm PDT',
};

// * =============================================================================
// *    Featured Events
// * =============================================================================
export const FEATURED_EVENTS: Event[] = [
  {
    id: uuid(),
    name: '⚜ Season of Duets',
    start: +new Date('2024-07-15'),
    end: +new Date('2024-09-29'),
    time: defaultTime,
    imageUrl:
      'https://img2.storyblok.com/fit-in/0x540/filters:format(webp)/f/108104/1920x1080/f9024e8f24/duets.jpg',
  },
  {
    id: uuid(),
    name: 'Days of Sunlight',
    start: +new Date('2024-08-26'),
    end: +new Date('9/12/2024'),
    time: defaultTime,
    imageUrl:
      'https://d2duuy9yo5pldo.cloudfront.net/thatgamecompany/224a70ea-0f87-48e7-8b56-6ec15a39befe.png',
  },
  {
    id: uuid(),
    name: 'Days of Moonlight',
    start: +new Date('9/16/2024'),
    end: +new Date('9/29/2024'),
    time: defaultTime,
    imageUrl:
      'https://d2duuy9yo5pldo.cloudfront.net/thatgamecompany/3c2fbe0c-def6-4af8-80af-1593619c278a.jpg',
  },
  {
    id: uuid(),
    name: 'Days of Style',
    start: +new Date('9/30/2024'),
    end: +new Date('10/13/2024'),
    time: defaultTime,
    imageUrl:
      'https://d2duuy9yo5pldo.cloudfront.net/thatgamecompany/d53da071-f7d4-4ed6-ad1c-98c305b70a1b.jpg',
  },
  {
    id: uuid(),
    name: 'Special Visit: Season of Shattering',
    start: +new Date('9/16/2024'),
    end: +new Date('9/29/2024'),
    time: defaultTime,
    imageUrl:
      'https://d2duuy9yo5pldo.cloudfront.net/thatgamecompany/96ecd722-7184-4df0-8d74-e6ecf5775284.jpg',
  },
  {
    id: uuid(),
    name: 'Double Light',
    start: +new Date('9/9/2024'),
    end: +new Date('9/29/2024'),
    time: defaultTime,
    imageUrl: imgDoubleLight,
  },
];

// * =============================================================================
// *    Predict and Shards events
// * =============================================================================
const shard = new Shards();

const today = new Date();
today.setHours(0, 0, 0, 0); // reset time

for (let i = 0; i < 25; i++) {
  const offset = 0; // offset days from today
  const target = DateTime.fromJSDate(today).plus({ days: i - offset });
  const shardsInfo = shard.getInfo(target);

  if (shardsInfo) {
    const date = +new Date(shardsInfo.dateStr);

    FEATURED_EVENTS.push({
      id: uuid(),
      name: shardsInfo.event,
      start: date,
      end: date,
      time: shardsInfo.time,
      tags: ['Red Shards'],
      imageUrl:
        'https://static.wikia.nocookie.net/sky-children-of-the-light/images/6/6c/Village_of_Dreams_%28Guide%29.jpg',
    });
  }
}
