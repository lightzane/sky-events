import { LucidePlus, LucideSettings } from 'lucide-react';
import { Event } from '../../data';
import { cn, DateUtil } from '../../shared/utils';

type Props = {
  events: Event[];
  addClick?: () => void;
  settingsClick?: () => void;
  onEventClick: (event: Event) => void;
};

export default ({ events, settingsClick, addClick, onEventClick }: Props) => {
  return (
    <>
      <div
        className={cn('sticky top-0 z-10 bg-sky-900 text-white p-4', {
          'p-5': !settingsClick,
        })}>
        <div className='flex justify-between items-center'>
          <span>Events</span>
          <div className='flex items-center'>
            {!!addClick && (
              <button
                onClick={addClick}
                type='button'
                className='group p-1 rounded-full relative transition-all duration-300'>
                <span>
                  <LucidePlus />
                </span>
                <span className='absolute inset-0 p-1 opacity-20 group-hover:blur-sm group-hover:opacity-70 transition-all duration-300'>
                  <LucidePlus />
                </span>
              </button>
            )}

            {!!settingsClick && (
              <button
                onClick={settingsClick}
                type='button'
                className='group p-1 rounded-full relative hover:rotate-90 transition-all duration-300'>
                <span>
                  <LucideSettings />
                </span>
                <span className='absolute inset-0 p-1 opacity-20 group-hover:blur-sm group-hover:opacity-70 transition-all duration-300'>
                  <LucideSettings />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      {events.map((event) => (
        <div
          role='button'
          onClick={() => {
            if (!DateUtil.isExpired(event.start, event.end)) {
              onEventClick(event);
            }
          }}
          key={event.id}
          className={cn(
            'p-5 bg-sky-100 text-sm md:text-base line-clamp-2 hover:bg-sky-200 transition duration-300',
            'h-28', // sync height with event-card.tsx
          )}>
          {event.name}
        </div>
      ))}
    </>
  );
};
