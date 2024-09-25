import { LucideChevronLeft, LucideChevronRight } from 'lucide-react';
import { cn, DateUtil } from '../../shared/utils';

type Props = {
  days: Date[] | number[];
  onPrevDayClick: () => void;
  onNextDayClick: () => void;
};

export default ({ days, onPrevDayClick, onNextDayClick }: Props) => {
  function handleDayClick(index: number) {
    // first and last column (for prev and next function)
    if (index === 0) {
      onPrevDayClick();
    } else if (index === days.length - 1) {
      onNextDayClick();
    }
  }

  return (
    <>
      {/* Days column */}
      {days.map((day, index) => (
        <div
          key={DateUtil.getDayName(day) + DateUtil.formatDateShort(day)}
          className={cn(
            'pointer-events-none select-none',
            'sticky top-0 z-20 transition-all duration-300 ease-in-out',
            'bg-sky-200 text-sky-950 p-3 border-l-2 border-l-sky-100 min-w-14',
            { 'bg-sky-100': DateUtil.isToday(day) },
            {
              'hover:rounded-md hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 z-30 cursor-pointer':
                index === 0 || index === days.length - 1, // first and last column (for prev and next function)
            },
            {
              'pointer-events-auto': index === 0 || index === days.length - 1,
            },
          )}
          onClick={() => handleDayClick(index)}>
          <div className='flex gap-x-1 items-center group'>
            {index === 0 && (
              <LucideChevronLeft className='text-blue-300 group-hover:text-blue-500 transition duration-300 shrink-0 hidden md:block absolute left-0 inset-y-0 h-full' />
            )}
            <div
              className={cn('flex flex-col text-sm', {
                'ml-3.5': index === 0,
              })}>
              <span>{DateUtil.getDayName(day)}</span>
              <span className='font-semibold'>
                {DateUtil.formatDateShort(day)}
              </span>
            </div>
            {index === days.length - 1 && (
              <LucideChevronRight className='text-blue-300 group-hover:text-blue-500 transition duration-300 shrink-0 hidden md:block absolute right-3 inset-y-0 h-full' />
            )}
          </div>
        </div>
      ))}

      {/* Future column */}
      <div
        className={cn(
          'sticky top-0 z-20',
          'bg-sky-200 text-sky-950 p-3 border-l-2 border-l-sky-100',
          'flex items-center',
        )}>
        <div className='text-sm'>Upcoming...</div>
      </div>
    </>
  );
};
