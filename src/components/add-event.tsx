import {
  LucideCalendar,
  LucideClock,
  LucidePlus,
  LucideUpload,
} from 'lucide-react';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { Event } from '../data';
import { cn, uuid } from '../shared/utils';
import DatePicker from './date-picker';
import ModalOverlay from './modal-overlay';

type Props = {
  editEvent?: Event;
  onImportClick: () => void;
  onStartDateChanged: (date: Date) => void;
  onSubmit: (event: Event, update: boolean) => void;
};

export default ({
  editEvent,
  onStartDateChanged,
  onSubmit,
  onImportClick,
}: Props) => {
  const [toggleDate, setToggleDate] = useState<'start' | 'end'>('start');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(startDate);

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Default date for datepicker
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [min, setMin] = useState<Date | undefined>();

  const [eventName, setEventName] = useState('');

  const eventNameRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLButtonElement>(null);
  const endDateRef = useRef<HTMLButtonElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (editEvent) {
      populateFields(editEvent);
    }
  }, [editEvent]);

  useEffect(() => {
    if (submitted) {
      setSubmitted(false);
      return;
    }

    onStartDateChanged(startDate);

    if (startDate > endDate) {
      setEndDate(startDate);
    }
  }, [startDate]);

  useEffect(() => {
    if (submitted) {
      const id = editEvent ? editEvent.id : uuid();

      const event: Event = {
        id,
        name: eventName.trim() ?? 'Untitled',
        start: +startDate,
        end: +endDate,
      };

      const timeStart = startTimeRef.current?.value.trim() || undefined; // ! Do not change the "||" to "??" since we don't want to accept empty string
      const timeEnd = endTimeRef.current?.value.trim() || undefined;

      if (timeStart || timeEnd) {
        event.time = {
          start: timeStart,
          end: timeEnd,
        };
      }

      event.imageUrl = imageUrlRef.current?.value.trim() || undefined;

      onSubmit(event, !!editEvent);
      reset();
    }
  }, [submitted]);

  function populateFields(event: Event) {
    const { name, start, end, imageUrl, time } = event;

    setEventName(name);

    if (eventNameRef.current) {
      eventNameRef.current.value = name;
    }

    setMin(new Date(start));
    setStartDate(new Date(start));
    setEndDate(new Date(end));

    if (imageUrl && imageUrlRef.current) {
      imageUrlRef.current.value = imageUrl;
    }

    if (time) {
      if (time.start) {
        setStartTime(time.start);
        if (startTimeRef.current) {
          startTimeRef.current.value = time.start;
        }
      }
      if (time.end) {
        setEndTime(time.end);
        if (endTimeRef.current) {
          endTimeRef.current.value = time.end;
        }
      }
    }
  }

  function reset() {
    const today = new Date();

    setShowDatePicker(false);
    setStartDate(today);
    setEndDate(today);
    setStartTime('');
    setEndTime('');
    setDefaultDate(today);
    setMin(undefined);
    setEventName('');

    if (eventNameRef.current) {
      eventNameRef.current.value = '';
    }

    if (imageUrlRef.current) {
      imageUrlRef.current.value = '';
    }
  }

  function handleDateBtnClick(whichDate: 'start' | 'end') {
    if (whichDate === 'start') {
      setToggleDate('start');
      setDefaultDate(startDate);
      setMin(undefined);
    }

    // end date
    else {
      setToggleDate('end');
      setDefaultDate(endDate);
      setMin(startDate);
    }

    setShowDatePicker(true);
  }

  function handleDatePicked(date: Date) {
    if (toggleDate === 'start') {
      setStartDate(date);
    }

    // end date
    else {
      setEndDate(date);
    }
  }

  function handleSubmit() {
    setSubmitted(true);
    // * when "submitted" is changed, a `useEffect` will be triggered
  }

  return (
    <div className='px-1 pb-3'>
      <div className='flex flex-col gap-y-5'>
        <h2 className='font-lg'>{editEvent ? 'Edit' : 'Add'} Event</h2>

        {/* Import */}
        {!editEvent && (
          <>
            <button
              type='button'
              className={cn(
                'w-full py-1.5 text-sm text-white font-semibold bg-emerald-500 hover:bg-emerald-400 rounded-lg shadow-md',
                'transition duration-300 ease-in-out',
                'flex items-center justify-center gap-x-1',
              )}
              onClick={onImportClick}>
              <LucideUpload className='w-5 h-5' />
              <span>Import YAML</span>
            </button>

            <hr />
          </>
        )}

        {/* Event Name */}
        <div>
          <label
            htmlFor='event-name'
            className='block text-sm font-medium leading-6 text-gray-900'>
            Event name
          </label>
          <div className='relative mt-2 rounded-md shadow-sm'>
            <input
              ref={eventNameRef}
              type='text'
              name='event-name'
              id='event-name'
              className='block w-full rounded-md border-0 py-1.5 pr-20 text-blue-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6'
              maxLength={20}
              onKeyUp={(e) => setEventName(e.currentTarget.value.trim())}
            />
          </div>
        </div>
        {/* end: Event name */}

        {/* Datetime */}
        <div className='grid grid-cols-2 gap-1 gap-x-3'>
          {/* Date Start */}
          <div>
            <label
              htmlFor='date-start'
              className='block text-sm font-medium leading-6 text-gray-900'>
              Start Date
            </label>
            <div className='relative mt-2 rounded-md shadow-sm'>
              <div className='absolute left-0 top-0 h-full flex items-center p-2'>
                <LucideCalendar className='w-5 h-5 text-blue-500' />
              </div>
              <button
                ref={startDateRef}
                type='button'
                name='date-start'
                id='date-start'
                className='w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                onClick={() => handleDateBtnClick('start')}>
                <span className='font-semibold text-blue-500'>
                  {DateTime.fromJSDate(startDate)
                    .toFormat('dd-MMM-yyyy')
                    .toUpperCase()}
                </span>
              </button>
            </div>

            {/* Add Start Time */}
            {!startTime && (
              <div className='relative mt-2 rounded-md shadow-sm'>
                <div className='absolute left-0 top-0 h-full flex items-center p-2'>
                  <LucidePlus className='w-5 h-5 text-gray-500' />
                </div>
                <button
                  type='button'
                  className='w-full rounded-md py-1.5 text-gray-900 border-2 border-gray-300 border-dashed placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                  onClick={() => setStartTime('12am')}>
                  Start time
                </button>
              </div>
            )}

            {/* Start Time */}
            {startTime && (
              <div className='relative mt-2 rounded-md shadow-sm'>
                <div className='absolute left-0 top-0 h-full flex items-center p-2'>
                  <LucideClock className='w-5 h-5 text-blue-500' />
                </div>
                <input
                  ref={startTimeRef}
                  type='text'
                  name='time-start'
                  id='time-start'
                  className='block w-full rounded-md border-0 py-1.5 text-center text-blue-700 ring-1 ring-inset ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6'
                  maxLength={20}
                  defaultValue={startTime}
                />
              </div>
            )}
          </div>

          {/* Date End */}
          <div>
            <label
              htmlFor='date-end'
              className='block text-sm font-medium leading-6 text-gray-900'>
              End Date
            </label>
            <div className='relative mt-2 rounded-md shadow-sm'>
              <div className='absolute left-0 top-0 h-full flex items-center p-2'>
                <LucideCalendar className='w-5 h-5 text-blue-500' />
              </div>
              <button
                ref={endDateRef}
                type='button'
                name='date-end'
                id='date-end'
                className='w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                onClick={() => handleDateBtnClick('end')}>
                <span className='font-semibold text-blue-500'>
                  {DateTime.fromJSDate(endDate)
                    .toFormat('dd-MMM-yyyy')
                    .toUpperCase()}
                </span>
              </button>
            </div>

            {/* Add End Time */}
            {!endTime && (
              <div className='relative mt-2 rounded-md shadow-sm'>
                <div className='absolute left-0 top-0 h-full flex items-center p-2'>
                  <LucidePlus className='w-5 h-5 text-gray-500' />
                </div>
                <button
                  type='button'
                  className='w-full rounded-md py-1.5 text-gray-900 border-2 border-gray-300 border-dashed placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                  onClick={() => setEndTime('11:59pm')}>
                  End time
                </button>
              </div>
            )}

            {/* End Time */}
            {endTime && (
              <div className='relative mt-2 rounded-md shadow-sm'>
                <div className='absolute left-0 top-0 h-full flex items-center p-2'>
                  <LucideClock className='w-5 h-5 text-blue-500' />
                </div>
                <input
                  ref={endTimeRef}
                  type='text'
                  name='time-end'
                  id='time-end'
                  className='block w-full rounded-md border-0 py-1.5 text-center text-blue-700 ring-1 ring-inset ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6'
                  maxLength={20}
                  defaultValue={endTime}
                />
              </div>
            )}
          </div>
        </div>
        {/* End datetime */}

        {/* Image URL */}
        <div>
          <label
            htmlFor='image-url'
            className='block text-sm font-medium leading-6 text-gray-900'>
            Image URL (optional)
          </label>
          <div className='relative mt-2 rounded-md shadow-sm'>
            <input
              ref={imageUrlRef}
              type='text'
              name='image-url'
              id='image-url'
              className='block w-full rounded-md border-0 py-1.5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>
        {/* end: Image URL */}

        <button
          type='button'
          className={cn(
            'px-3 py-1.5 bg-emerald-500 text-white rounded-lg shadow-md hover:bg-emerald-400 font-semibold text-sm',
            'disabled:pointer-events-none disabled:opacity-30 disabled:bg-gray-500',
            { 'bg-yellow-500 hover:bg-yellow-400': editEvent },
          )}
          disabled={!eventName.trim()}
          onClick={handleSubmit}>
          {editEvent ? 'Update event' : 'Submit'}
        </button>
      </div>

      {/* DatePicker */}
      <ModalOverlay showModal={showDatePicker} withPlate={false}>
        <DatePicker
          show={showDatePicker}
          min={min}
          onClose={() => setShowDatePicker(false)}
          onDatePicked={(date) => handleDatePicked(date)}
          defaultDate={defaultDate}
        />
      </ModalOverlay>
    </div>
  );
};
