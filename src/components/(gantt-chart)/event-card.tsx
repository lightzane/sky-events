import { Event } from '../../data';
import { cn, DateUtil } from '../../utils';

type Props = {
  days: Date[];
  event: Event;
  index: number;
};

export default ({ days, event, index }: Props) => {
  function getColumnDays(): number {
    // Within Range
    if (DateUtil.getWeekIndex(days, event.start) >= 0) {
      return DateUtil.getWeekIndex(days, event.start) + 1;
    }

    // First column: Event = Expired or Past date
    if (
      !DateUtil.isExpired(event.start, event.end, +days[0]) &&
      !DateUtil.isFutureOutsideRange(event.start, days[days.length - 1])
    ) {
      return 1;
    }

    // Last column: Event = Future date
    return days.length + 1;
  }

  function getSpanDays(): number {
    // Within range
    if (DateUtil.getWeekIndex(days, event.start) >= 0) {
      return DateUtil.getTotalDays(event.start, event.end) + 1;
    }

    // Past/Future date will always make the first day (visible in view date range) as the startDate
    return DateUtil.getTotalDays(event.end, days[0]) + 1;
  }

  return (
    <div
      key={event.id}
      className={cn(
        'text-sm md:text-base p-5 relative left-[0.2%] truncate',
        'h-28', // sync height with events-list.tsx
        {
          'shadow-md text-center': !DateUtil.isFutureOutsideRange(
            event.start,
            days[days.length - 1],
          ),
          'bg-green-200': !DateUtil.isExpired(event.start, event.end, +days[0]),
          'bg-red-200': DateUtil.isEqual(event.end, +days[0]),
          'bg-purple-200': DateUtil.isFutureOutsideRange(
            event.start,
            days[days.length - 1],
          ),
          'opacity-0 pointer-events-none': DateUtil.isExpired(
            event.start,
            event.end,
            +days[0],
          ),
        },
      )}
      // Card positioning on grid row and column
      style={{
        gridRow: index + 2,
        // grid-column: "{ gridColumn } / span { gridColumnEnd }"
        gridColumn: `${getColumnDays()} / span ${getSpanDays()}`,
      }}>
      {/* Line Border top */}
      <div
        className={cn('absolute z-10 w-full h-1 bg-green-600 top-0 left-0', {
          'bg-green-600': !DateUtil.isExpired(event.start, event.end, +days[0]),
          'bg-red-600': DateUtil.isEqual(event.end, +days[0]),
          'bg-purple-600': DateUtil.isFutureOutsideRange(
            event.start,
            days[days.length - 1],
          ),
        })}></div>

      {/* Event Image */}
      {event.imageUrl && (
        <>
          <div
            className={cn('absolute top-0 left-0 w-[45%] h-[200%]', {
              'w-full': DateUtil.isFutureOutsideRange(
                event.start,
                days[days.length - 1],
              ),
            })}>
            <div className='relative h-full w-full'>
              {/* Gradient Blur (middle) */}
              <div
                className={cn(
                  'absolute top-0 right-0 w-[60%] h-full bg-gradient-to-r from-transparent to-green-200',
                  {
                    'to-purple-200 opacity-0': DateUtil.isFutureOutsideRange(
                      event.start,
                      days[days.length - 1],
                    ),
                  },
                )}></div>
              <img
                // remove `.h-full.w-full` if don't want to stretch image, but it will be small
                className={cn('h-full w-full', {
                  'opacity-20': DateUtil.isFutureOutsideRange(
                    event.start,
                    days[days.length - 1],
                  ),
                })}
                src={event.imageUrl}
                alt='Event image'
              />
            </div>
          </div>
          {/* Gradient Blur (whole) */}
          <div
            className={cn(
              'absolute top-0 left-0 w-[60%] h-full bg-gradient-to-r from-transparent to-green-200',
              {
                'to-purple-200 opacity-0': DateUtil.isFutureOutsideRange(
                  event.start,
                  days[days.length - 1],
                ),
              },
            )}></div>
        </>
      )}

      {/* Event name */}
      <div
        className={cn('flex flex-col z-10 relative', {
          future: DateUtil.isFutureOutsideRange(
            event.start,
            days[days.length - 1],
          ),
        })}>
        <span className='font-semibold'>{event.name}</span>
        <span className='text-gray-600'>{`${DateUtil.format(
          event.start,
        )} - ${DateUtil.format(event.end)}`}</span>
      </div>
    </div>
  );
};
