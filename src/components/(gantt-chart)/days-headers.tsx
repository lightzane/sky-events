import { cn, DateUtil } from '../../utils';

type Props = {
  days: Date[] | number[];
};

export default ({ days }: Props) => {
  return (
    <>
      {/* Days column */}
      {days.map((day) => (
        <div
          key={DateUtil.getDayName(day) + DateUtil.format(day)}
          className={cn(
            'sticky top-0 z-20',
            'bg-sky-200 text-sky-950 p-3 border-l-2 border-l-sky-100',
            { 'bg-sky-100': DateUtil.isToday(day) },
          )}>
          <div className='flex flex-col text-sm'>
            <span>{DateUtil.getDayName(day)}</span>
            <span className='font-semibold'>{DateUtil.format(day)}</span>
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
