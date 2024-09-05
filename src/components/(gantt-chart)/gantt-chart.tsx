import { LucideMoonStar } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Event } from '../../data';
import { cn, DateUtil, sortEvents, uuid } from '../../shared/utils';
import DaysHeaders from './days-headers';
import EventCard from './event-card';
import EventsList from './events-list';

import './gantt-chart.css';

type Props = {
  events: Event[];
  addClick?: () => void;
  settingsClick?: () => void;
  spanDaysInput?: number;
  currentDate?: Date;
  onPrevDayClick: () => void;
  onNextDayClick: () => void;
  onEventClick: (event: Event) => void;
};

export default ({
  events,
  addClick,
  settingsClick,
  onEventClick,
  spanDaysInput = 7, // Default: 1 week
  currentDate = new Date(),
  onPrevDayClick,
  onNextDayClick,
}: Props) => {
  // Date range to be displayed on the timeline
  const [days, setDays] = useState<Date[]>(
    DateUtil.getSpanDays(spanDaysInput, new Date(currentDate)),
  );

  // Update CSS variable
  // Access the root element
  const root = document.documentElement;

  const [sortedEvents, setSortedEvents] = useState(
    sortEvents(events, +days[0]),
  );

  useEffect(() => {
    setDays(DateUtil.getSpanDays(spanDaysInput));

    // Update the custom property --span-days to reflect with the number of Days column
    root.style.setProperty('--span-days', (spanDaysInput + 1).toString()); // Default: 1 week (plus 1 for "Upcoming" column)
  }, [spanDaysInput]);

  useEffect(() => {
    setSortedEvents(sortEvents(events, +days[0]));
  }, [events]);

  useEffect(() => {
    setDays(DateUtil.getSpanDays(spanDaysInput, new Date(currentDate)));
    setSortedEvents(sortEvents(events, +currentDate));
  }, [currentDate, spanDaysInput]);

  return (
    <div className={cn('grid grid-cols-12', 'max-w-7xl sm:max-w-full')}>
      {/* Events List Grid */}
      <div className='grid gap-y-2 col-span-2'>
        <EventsList
          events={sortedEvents}
          addClick={addClick}
          settingsClick={settingsClick}
          onEventClick={onEventClick}
        />
      </div>

      {/* Main Grid: Gantt Chart */}
      <div
        className={cn(
          'gantt relative col-span-10',
          // 'overflow-auto', // Breaks the "sticky" of days headers
        )}>
        {/* Days Headers */}
        <DaysHeaders
          days={days}
          onNextDayClick={onNextDayClick}
          onPrevDayClick={onPrevDayClick}
        />

        {/* Events */}
        {sortedEvents.map((event, index) => (
          <EventCard
            key={event.id}
            days={days}
            event={event}
            index={index}
            onClick={onEventClick}
          />
        ))}

        {/* Column lines */}
        <div className='absolute inset-0 -z-10 vertical-lines'>
          {days.map(() => (
            <div
              key={uuid()}
              className='w-full h-full border-r-2 border-r-gray-300 min-w-14'></div>
          ))}
        </div>
      </div>

      {/* No events */}
      {!sortedEvents.length && (
        <div className='flex col-span-12 justify-center items-center h-[30svh] bg-stone-200 rounded-b-lg'>
          <div className='flex flex-col justify-center items-center gap-y-3 pointer-events-none select-none'>
            <LucideMoonStar className='text-3xl text-gray-600/90' size={50} />
            <div className='text-lg'>No active or upcoming events</div>
          </div>
        </div>
      )}
    </div>
  );
};
