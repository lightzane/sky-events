import { Event } from '../../data';
import { cn } from '../../utils';

type Props = {
  events: Event[];
};

export default ({ events }: Props) => {
  return (
    <>
      <div className='sticky top-0 z-10 bg-sky-900 text-white p-5'>Events</div>
      {events.map((event) => (
        <div
          key={event.id}
          className={cn(
            'p-5 bg-sky-100 text-sm md:text-base line-clamp-2',
            'h-28', // sync height with event-card.tsx
          )}>
          {event.name}
        </div>
      ))}
    </>
  );
};
