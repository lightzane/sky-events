import { DateTime } from 'luxon';
import { DateUtil } from '../shared/utils';

type ShardsInfo = {
  dateStr: string;
  time: { start: string; end: string };
  event: string;
};

type Realm = {
  [key: string]: string | (() => string);
} & {
  name: () => string;
};

type Realms = {
  [key: string]: Realm;
};

const realms: Realms = {
  prarie: {
    name: () => 'Daylight Prarie',
    cave: 'Cave',
    bird: 'Bird Nest',
    sanctuary: 'Sanctuary Island',
  },

  forest: {
    name: () => 'Hidden Forest',
    garden: 'Forest Garden',
    treehouse: 'Treehouse',
    elevated: 'Elevated Clearing',
  },

  valley: {
    name: () => 'Valley of Triumph',
    dreams: 'Village of Dreams',
    hermit: 'Hermit Valley',
  },

  wasteland: {
    name: () => 'Golden Wasteland',
    graveyard: 'Graveyard',
    crabfield: 'Crabfield',
    ark: 'Forgotten Ark',
  },

  vault: {
    name: () => 'Vault of Knowledge',
    jellyfish: 'Jellyfish Cove',
  },
};

/** `07:48am PDT >> 11:40pm PDT` */
const time_1st = {
  start: '07:48am PDT',
  end: '11:40pm PDT',
};

/** `02:28am PDT >> 04:20pm PDT` */
const time_3rd = {
  start: '02:28am PDT',
  end: '04:20pm PDT',
};

/** `03:38am PDT >> 07:30pm PDT` */
const time_5th = {
  start: '03:38am PDT',
  end: '07:30pm PDT',
};

const eruptions = [
  // Since 1st day of month
  {
    time: time_1st,
    no_shards: [1, 2], // Mon, Tue
    locations: [
      realms.prarie.cave,
      realms.forest.garden,
      realms.valley.dreams,
      realms.wasteland.graveyard,
      realms.vault.jellyfish,
    ],
  },

  // Since 3rd day of month
  {
    time: time_3rd,
    no_shards: [2, 3], // Tue, Wed
    locations: [
      realms.prarie.bird,
      realms.forest.treehouse,
      realms.valley.dreams,
      realms.wasteland.crabfield,
      realms.vault.jellyfish,
    ],
  },

  // Since 5th day of month
  {
    time: time_5th,
    no_shards: [3, 4], // Wed, Thu
    locations: [
      realms.prarie.sanctuary,
      realms.forest.elevated,
      realms.valley.hermit,
      realms.wasteland.ark,
      realms.vault.jellyfish,
    ],
  },
];

export class Shards {
  getInfo(date: DateTime): ShardsInfo | null {
    const target = date.setZone('America/Los_Angeles').startOf('day');
    const dayOfMonth = target.day;
    const dayOfWeek = target.weekday;

    const nth = dayOfMonth % 6; // every 6 days from nth of every month

    const redShards = [1, 3, 5]; // from 1st/3rd/5th day of every month
    const isRedShard = redShards.includes(nth);

    if (!isRedShard) {
      return null;
    }

    const eruptionSlot = eruptions[redShards.indexOf(nth)];

    if (eruptionSlot.no_shards.includes(dayOfWeek)) {
      return null;
    }

    let locationSlot = dayOfMonth % 5; // 5 realms takes alternate turns
    locationSlot -= 1; // location list starts at 0 index

    if (locationSlot === -1 && dayOfMonth % 5 === 0) {
      locationSlot = 4; // should get the 5th index
    }

    const location = eruptionSlot.locations[locationSlot];
    const realmKey = Object.keys(realms)[locationSlot];
    const realm = realms[realmKey];

    return {
      event: `🔺 Red Shard in ${location}, ${realm.name()}`,
      dateStr: DateUtil.formatDateLong(new Date(target.toJSDate())),
      time: eruptionSlot.time,
    };
  }
}
