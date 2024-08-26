import { Fragment } from 'react/jsx-runtime';

import { Event } from '../../data';
import { DateUtil, sortEvents } from '../../utils';
import DaysHeaders from './days-headers';
import EventCard from './event-card';
import EventsList from './events-list';

type Props = {
  events: Event[];
};

export default ({ events }: Props) => {
  const days = DateUtil.getCurrentWeek();

  const sortedEvents = sortEvents(events);

  return (
    <div className='grid grid-cols-12 max-w-7xl sm:max-w-full'>
      {/* Events List Grid */}
      <div className='grid gap-y-2 col-span-2'>
        <EventsList events={events} />
      </div>

      {/* Main Grid: Gantt Chart */}
      <div className='gantt col-span-10'>
        {/* Days Headers */}
        <DaysHeaders days={days} />

        {/* Events */}
        {sortedEvents.map((event, index) => (
          <Fragment key={event.id}>
            {/* Events Start date Within date range */}
            {DateUtil.getWeekIndex(days, event.start) >= 1 ? (
              <EventCard days={days} event={event} index={index} />
            ) : (
              // Events Outside date range or last day
              <EventCard days={days} event={event} index={index} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
