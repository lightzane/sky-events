import { useEffect, useState } from 'react';
import { cn } from '../shared/utils';

type Props = {
  /** When `true`, displays the datepicker */
  show: boolean;
  /** Dates beyond `max` value cannot be selected */
  max?: Date;
  /** Dates past `min` value cannot be selected */
  min?: Date;
  /** The default date to display upon appearance of Datepicker */
  defaultDate?: Date;

  onDatePicked: (date: Date) => void;
  onClose: () => void;
};

export default ({
  show,
  min,
  max,
  defaultDate,
  onDatePicked,
  onClose,
}: Props) => {
  if (min && isOverMax(min)) {
    throw new Error('Datepicker: MIN cannot be set beyond MAX');
  }

  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(defaultDate || today);

  // Current view in calendar
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based
  const [calendarDays, setCalendarDays] = useState(
    generateCalendarDates(year, month),
  );

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Update selected date that it will not violate min/max dates
  useEffect(() => {
    if (min && isUnderMin(selectedDate)) {
      setSelectedDate(min);
    }

    if (max && isOverMax(selectedDate)) {
      setSelectedDate(max);
    }
  }, [min, max]);

  // Update calendar view when month/year is changed
  useEffect(() => {
    setCalendarDays(generateCalendarDates(year, month));
  }, [year, month]);

  // Select date is updated
  useEffect(() => {
    setYear(selectedDate.getFullYear());
    setMonth(selectedDate.getMonth());
    onDatePicked(selectedDate);
  }, [selectedDate]);

  function handlePrevMonth() {
    let m = month;

    if (m === 0) {
      m = 11; // Move to december prev year
      setYear(year - 1);
    } else {
      m--; // just go prev month
    }

    setMonth(m);
  }

  function handleNextMonth() {
    let m = month;

    if (m === 11) {
      m = 0; // Move to January next year
      setYear(year + 1);
    } else {
      m++; // just go next month
    }

    setMonth(m);
  }

  /** `dd-MMM-yyyy` format */
  function format(date: Date): string {
    const dd = date.getDate();
    const MMM = date.toLocaleDateString('en-US', { month: 'short' });
    const yyyy = date.getFullYear();

    return `${dd}-${MMM}-${yyyy}`;
  }

  /** Resets time to 12am or 00:00 */
  function resetTime(date: Date): number {
    return new Date(date).setHours(0, 0, 0, 0);
  }

  /** Month starts with zero. (e.g 0 = January, 11 = December) */
  // function getTotalDaysOfMonth(year: number, month: number) {
  //   // Months are index-based on starts at zero.
  //   // 0 = January, 1 = February ... 11 = December
  //   // Add 1 month to get the "next month"
  //   // Then provide zero "0" as days that will get the last date of the "previous month".
  //   return new Date(year, month + 1, 0).getDate();
  // }

  function generateCalendarDates(year: number, month: number): Date[] {
    // month is 0-based, so the next month is month + 1
    // Get the first day of the current month
    const firstDayOfMonth = new Date(year, month, 1);
    // Find the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay();

    // Determine the start date for the calendar (the previous month if necessary)
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(1 - firstDayWeekday);

    // Extra week to cover last days or first week of next month
    const endDateForCalendar = new Date(year, month + 1, 14);
    // 7 = until 1st week of next month
    // 14 = until 2nd week of next month

    // Generate an array of dates from startDate to endDateForCalendar
    const calendarDates: Date[] = [];
    let currentDate = startDate;

    while (
      currentDate <= endDateForCalendar &&
      calendarDates.length < 42
      // 35 = until 1st week of next month
      // 42 = until 2nd week of next month
    ) {
      calendarDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendarDates;
  }

  function getMonthName(month: number): string {
    return new Date(new Date().setMonth(month)).toLocaleDateString('en-US', {
      month: 'long',
    });
  }

  /** @returns `true` when `date` is **beyond** the `ax` date */
  function isOverMax(date: Date): boolean {
    if (max && resetTime(date) > resetTime(max)) {
      return true;
    }

    return false;
  }

  /** @returns `true` when `date` is **past** the `min` date */
  function isUnderMin(date: Date): boolean {
    if (min && resetTime(date) < resetTime(min)) {
      return true;
    }

    return false;
  }

  return (
    <div className='relative max-w-xs pointer-events-none'>
      {/* Container: Calendar */}
      <div
        className={cn(
          'p-1 px-3 shadow-lg rounded-xl ring-1 ring-gray-300 bg-white',
          {
            'pointer-events-auto': show,
            'pointer-events-none': !show,
          },
        )}>
        {/* Header */}
        <div className='flex justify-between items-center py-1'>
          {/* Prev month */}
          <div>
            <button
              type='button'
              title='Prev month'
              className='text-xl outline-none font-mono w-5 h-5 rounded-full p-5 hover:bg-blue-500 hover:text-gray-200 hover:shadow-lg cursor-pointer transition duration-300 flex justify-center items-center'
              onClick={handlePrevMonth}>
              &lt;
            </button>
          </div>

          {/* Month/Year */}
          <div className='flex justify-between items-center gap-x-3'>
            <button
              type='button'
              className='p-1 rounded-lg px-2 hover:ring-2 hover:ring-blue-500 hover:shadow-md cursor-pointer transition duration-300'
              onClick={() => setShowMonthPicker(true)}>
              {getMonthName(month)}
            </button>
            <button
              type='button'
              className='p-1 rounded-lg px-2 hover:ring-2 hover:ring-blue-500 hover:shadow-md cursor-pointer transition duration-300'
              onClick={() => setShowYearPicker(true)}>
              {year}
            </button>
          </div>

          {/* Next month */}
          <button
            type='button'
            title='Next month'
            className='text-xl outline-none font-mono w-5 h-5 rounded-full p-5 hover:bg-blue-500 hover:text-gray-200 hover:shadow-lg cursor-pointer transition duration-300 flex justify-center items-center'
            onClick={handleNextMonth}>
            &gt;
          </button>
        </div>

        {/* Name of days */}
        <div className='grid grid-cols-7 gap-1 py-2 bg-sky-100 rounded-lg shadow-sm'>
          <div className='text-center text-sm'>Su</div>
          <div className='text-center text-sm'>Mo</div>
          <div className='text-center text-sm'>Tu</div>
          <div className='text-center text-sm'>We</div>
          <div className='text-center text-sm'>Th</div>
          <div className='text-center text-sm'>Fr</div>
          <div className='text-center text-sm'>Sa</div>
        </div>

        {/* Calendar Days */}
        <div className='grid grid-cols-7 gap-1 gap-y-0.5'>
          {calendarDays.map((calendarDay) => (
            <button
              key={+calendarDay}
              className={cn(
                'w-10 h-10 rounded-full flex justify-center items-center outline-none mx-auto',
                'hover:bg-blue-100 transition duration-300 hover:ring-2 hover:ring-blue-500 ring-offset-2',
                'disabled:pointer-events-none',
                {
                  'bg-yellow-300 font-bold':
                    resetTime(calendarDay) === resetTime(today),
                  '!bg-blue-500 !text-white':
                    resetTime(calendarDay) === resetTime(selectedDate),
                  'text-red-500':
                    isOverMax(calendarDay) || isUnderMin(calendarDay),
                },
              )}
              disabled={isOverMax(calendarDay) || isUnderMin(calendarDay)}
              onClick={() => setSelectedDate(calendarDay)}>
              <span
                className={cn({
                  'opacity-30': calendarDay.getMonth() !== month,
                })}>
                {calendarDay.getDate()}
              </span>
            </button>
          ))}
        </div>

        {/* Others ======================= */}
        <div className='flex justify-between items-center px-3 py-2'>
          {/* Today */}
          <button
            type='button'
            className={cn(
              'px-3 py-1 rounded-lg hover:ring-2 hover:ring-blue-500 hover:shadow-lg',
              {
                'pointer-events-none opacity-30':
                  month === selectedDate.getMonth() &&
                  (resetTime(selectedDate) === resetTime(today) ||
                    isOverMax(today) ||
                    isUnderMin(today)),
              },
            )}
            disabled={isOverMax(today) || isUnderMin(today)}
            onClick={() => {
              if (isUnderMin(today) || isOverMax(today)) {
                return;
              }
              setSelectedDate(today);
            }}>
            <span className='text-sm font-semibold'>TODAY</span>
          </button>

          {/* Selected */}
          <div className=''>
            <button
              type='button'
              className='text-blue-700 cursor-pointer uppercase text-sm font-semibold'
              onClick={() => setSelectedDate(new Date(selectedDate))}>
              {format(selectedDate)}
            </button>
          </div>

          {/* Confirm */}
          <div>
            <button
              type='button'
              className={cn(
                'px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white text-red-500 hover:shadow-lg transition duration-300',
              )}
              onClick={onClose}>
              <span className='text-sm font-semibold'>CLOSE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Container: Month picker */}
      <div
        className={cn(
          'absolute inset-0 shadow-lg rounded-xl font-light bg-white w-full h-full',
          'duration-300 transition-all',
          {
            'pointer-events-auto': show,
            'pointer-events-none': !show,
          },
          {
            'opacity-0 !pointer-events-none': !showMonthPicker,
          },
        )}>
        <div className='flex h-full justify-center items-center p-1'>
          <div className='grid grid-cols-3 gap-1'>
            {new Array(12).fill('').map((_, index) => (
              <button
                type='button'
                key={getMonthName(index)}
                className={cn(
                  'text-center p-5 rounded-lg text-2xl uppercase',
                  'hover:bg-blue-200 duration-300 transition',
                  {
                    '!bg-blue-500 !text-white': month === index,
                  },
                )}
                onClick={() => {
                  setShowMonthPicker(false);
                  setMonth(index);
                }}>
                {getMonthName(index).substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Container: Year picker */}
      <div
        className={cn(
          'absolute inset-0 shadow-lg rounded-xl font-light bg-white w-full h-full',
          'duration-300 transition-all ease-in-out',
          {
            'pointer-events-auto': show,
            'pointer-events-none': !show,
          },
          {
            'opacity-0 !pointer-events-none': !showYearPicker,
          },
        )}>
        <div className='flex h-full justify-center items-center p-1'>
          <div className='grid grid-cols-3 gap-1'>
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((yearOffset) => (
              <button
                type='button'
                key={getMonthName(yearOffset)}
                className={cn(
                  'text-center p-5 rounded-lg text-xl uppercase',
                  'hover:bg-blue-200 duration-300 transition ease-in-out',
                  {
                    '!bg-blue-500 !text-white':
                      year === yearOffset + today.getFullYear(),
                  },
                )}
                onClick={() => {
                  setShowYearPicker(false);
                  setYear(yearOffset + today.getFullYear());
                }}>
                {yearOffset + today.getFullYear()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
