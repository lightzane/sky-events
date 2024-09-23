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

/** `12am PDT >> 11:59pm PDT` */
const defaultTime = {
  start: '12am PDT',
  end: '11:59pm PDT',
};

/** `02:28am PDT >> 04:20pm PDT` */
const timeShardAfternoonA = {
  start: '02:28am PDT',
  end: '04:20pm PDT',
};

/** `03:38am PDT >> 07:30pm PDT` */
const timeShardAfternoonB = {
  start: '03:38am PDT',
  end: '07:30pm PDT',
};

/** `07:48am PDT >> 11:40pm PDT` */
const timeShardEvening = {
  start: '07:48am PDT',
  end: '11:40pm PDT',
};

import imgDoubleLight from '../assets/Double-candle-event-September-2024.webp';

export const FEATURED_EVENTS: Event[] = [
  {
    id: uuid(),
    name: '🔺 Red Shard in Forgotten Ark, Golden Wasteland',
    start: +new Date('2024-09-29'),
    end: +new Date('2024-09-29'),
    time: timeShardAfternoonB,
    imageUrl:
      'https://static.wikia.nocookie.net/sky-children-of-the-light/images/0/01/SOShattering-radiant-shards.jpg/revision/latest/scale-to-width-down/193?cb=20220625005023',
  },
  {
    id: uuid(),
    name: '🔺 Red Shard in Treehouse, Hidden Forest',
    start: +new Date('2024-09-27'),
    end: +new Date('2024-09-27'),
    time: timeShardAfternoonA,
    imageUrl:
      'https://static.wikia.nocookie.net/sky-children-of-the-light/images/0/01/SOShattering-radiant-shards.jpg/revision/latest/scale-to-width-down/193?cb=20220625005023',
  },
  {
    id: uuid(),
    name: '🔺 Red Shard in Jellyfish Cove, Vault of Knowledge',
    start: +new Date('2024-09-25'),
    end: +new Date('2024-09-25'),
    time: timeShardEvening,
    imageUrl:
      'https://static.wikia.nocookie.net/sky-children-of-the-light/images/0/01/SOShattering-radiant-shards.jpg/revision/latest/scale-to-width-down/193?cb=20220625005023',
  },
  {
    id: uuid(),
    name: '🔺 Red Shard in Hermit Valley, Valley of Triumph',
    start: +new Date('2024-09-23'),
    end: +new Date('2024-09-23'),
    time: timeShardAfternoonB,
    imageUrl:
      'https://static.wikia.nocookie.net/sky-children-of-the-light/images/0/01/SOShattering-radiant-shards.jpg/revision/latest/scale-to-width-down/193?cb=20220625005023',
  },
  {
    id: uuid(),
    name: '🔺 Red Shard in Bird Nest, Daylight Prarie',
    start: +new Date('2024-09-21'),
    end: +new Date('2024-09-21'),
    time: timeShardAfternoonA,
    imageUrl:
      'https://static.wikia.nocookie.net/sky-children-of-the-light/images/0/01/SOShattering-radiant-shards.jpg/revision/latest/scale-to-width-down/193?cb=20220625005023',
  },
  {
    id: uuid(),
    name: '🔺 Red Shard in Elevated Clearing, Hidden Forest',
    start: +new Date('2024-09-19'),
    end: +new Date('2024-09-19'),
    time: timeShardEvening,
    imageUrl:
      'https://static.wikia.nocookie.net/sky-children-of-the-light/images/0/01/SOShattering-radiant-shards.jpg/revision/latest/scale-to-width-down/193?cb=20220625005023',
  },
  {
    id: uuid(),
    name: '🔺 Red Shard in Elevated Clearing, Hidden Forest',
    start: +new Date('2024-09-17'),
    end: +new Date('2024-09-17'),
    time: timeShardAfternoonB,
    imageUrl:
      'https://static.wikia.nocookie.net/sky-children-of-the-light/images/0/01/SOShattering-radiant-shards.jpg/revision/latest/scale-to-width-down/193?cb=20220625005023',
  },
  {
    id: uuid(),
    name: '🔺 Red Shard in Jellyfish Cove, Vault of Knowledge',
    start: +new Date('2024-09-15'),
    end: +new Date('2024-09-15'),
    time: timeShardAfternoonA,
    imageUrl:
      'https://static.wikia.nocookie.net/sky-children-of-the-light/images/0/01/SOShattering-radiant-shards.jpg/revision/latest/scale-to-width-down/193?cb=20220625005023',
  },
  {
    id: uuid(),
    name: '🔺 Red Shard in Village of Dreams, Valley of Triumph',
    start: +new Date('2024-09-13'),
    end: +new Date('2024-09-13'),
    time: timeShardEvening,
    imageUrl:
      'https://static.wikia.nocookie.net/sky-children-of-the-light/images/0/01/SOShattering-radiant-shards.jpg/revision/latest/scale-to-width-down/193?cb=20220625005023',
  },
  {
    id: uuid(),
    name: '🔺 Red Shard in Crab Field, Golden Wasteland',
    start: +new Date('2024-09-09'),
    end: +new Date('2024-09-09'),
    time: timeShardAfternoonA,
    imageUrl:
      'https://static.wikia.nocookie.net/sky-children-of-the-light/images/0/01/SOShattering-radiant-shards.jpg/revision/latest/scale-to-width-down/193?cb=20220625005023',
  },
  {
    id: uuid(),
    name: '🔺 Red Shard in Forest Garden, Hidden Forest',
    start: +new Date('2024-09-07'),
    end: +new Date('2024-09-07'),
    time: timeShardEvening,
    imageUrl:
      'https://static.wikia.nocookie.net/sky-children-of-the-light/images/0/01/SOShattering-radiant-shards.jpg/revision/latest/scale-to-width-down/193?cb=20220625005023',
  },
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
