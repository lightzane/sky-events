import { uuid } from '../shared/utils';

export type Event = {
  id: string;
  name: string;
  start: number;
  end: number;
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

const defaultTime = {
  start: '12am PDT',
  end: '11:59pm PDT',
};

export const FEATURED_EVENTS: Event[] = [
  {
    id: uuid(),
    name: 'Days of Sunlight',
    start: +new Date('2024-08-26'),
    end: +new Date('9/8/2024'),
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
    end: +new Date('9/15/2024'),
    time: defaultTime,
  },
];
