import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

import { Event } from '../data';
import { DateUtil } from '../shared/utils';
import ModalOverlay from './modal-overlay';
import { LucideLoader2 } from 'lucide-react';

type Props = {
  event?: Event;
  onClose: () => void;
};

export default ({ event, onClose }: Props) => {
  const [show, setShow] = useState(false);

  // to be used on countdown
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let countdownInterval: ReturnType<typeof setInterval>;

    if (event) {
      setShow(true);

      if (
        !DateUtil.isFutureOutsideRange(event.start, new Date()) ||
        (event.end > now && now > event.start)
      ) {
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
      }
    } else {
      setShow(false);
    }

    function updateCountdown() {
      if (!event) {
        return;
      }

      const now = Date.now();
      setNow(now);

      /** Difference in milliseconds */
      const diff = event.end - now;

      // Timeout
      if (diff < 0) {
        clearInterval(countdownInterval);
      }

      const second = 1000;
      const minute = 60 * second;
      const hour = 60 * minute;
      const day = 24 * hour;

      const d = Math.floor(diff / day);
      const h = Math.floor((diff % day) / hour);
      const m = Math.floor((diff % hour) / minute);
      // const s = Math.floor((diff % minute) / second);

      setDays(d);
      setHours(h);
      setMinutes(m);
    }

    return () => {
      clearInterval(countdownInterval);
      setDays(0);
      setHours(0);
      setMinutes(0);
    };
  }, [event]);

  /** Typically used in "EVENT WILL LAST" */
  function DateEndComponent() {
    if (!event) {
      return <></>;
    }

    return (
      <div className='text-gray-800'>
        {DateUtil.isToday(event.end) ? (
          <>
            Today {DateTime.fromMillis(event.end).toFormat('t')}
            {/* cccc t = Monday 12:00 AM */}
          </>
        ) : (
          <>
            {DateTime.fromMillis(event.end).toFormat('LLL L, cccc t')}
            {/* LLL L, cccc t = Sep 9, Monday 12:00 AM */}
          </>
        )}
      </div>
    );
  }

  return (
    <ModalOverlay
      className='max-w-xs relative'
      showModal={show}
      onClose={() => {
        setShow(false);
        onClose();
      }}>
      {event && (
        <>
          {/* Set backgroudn image */}
          {event.imageUrl && (
            <div className='absolute inset-0 rounded-lg overflow-hidden pointer-events-none'>
              <img src={event.imageUrl} className='opacity-10' />
            </div>
          )}

          {/* Card content */}
          <div className='flex flex-col gap-y-2'>
            {/* Header */}
            <div className='flex flex-col border-b-2 border-b-gray-200 pb-2'>
              <span className='text-gray-500 uppercase text-xs'>
                <span className='font-semibold text-base'>
                  {DateUtil.getTotalDays(event.start, event.end)}
                </span>{' '}
                day event
              </span>
              <span className='font-semibold text-xl'>{event.name}</span>
            </div>

            {/* Event ended */}
            {(days < 0 || hours < 0 || minutes < 0) && (
              <div className='flex flex-col gap-1 p-5 rounded-md bg-emerald-100'>
                <div className='text-xs text-red-500 font-semibold'>
                  EVENT HAS ENDED
                </div>
                <DateEndComponent />
              </div>
            )}

            {/* On-going event + countdown */}
            {(!DateUtil.isFutureOutsideRange(event.start, new Date()) ||
              (event.end > now && now > event.start)) &&
              (days > -1 || hours > -1 || minutes > -1) && (
                <div className='flex flex-col gap-1 p-5 rounded-md bg-emerald-100'>
                  <div className='text-xs text-gray-700'>
                    THE EVENT WILL LAST
                  </div>
                  <div className='flex items-end animate-pulse text-orange-600'>
                    {!days && !hours && !minutes && (
                      <div className='animate-spin'>
                        <LucideLoader2 />
                      </div>
                    )}
                    {!!days && (
                      <div className='mx-1.5'>
                        <span className='text-3xl'>{days}</span>
                        <span className='text-xl'>d</span>
                      </div>
                    )}
                    {!!hours && (
                      <div className='mx-1.5'>
                        <span className='text-3xl'>{hours}</span>
                        <span className='text-xl'>h</span>
                      </div>
                    )}
                    {!!minutes && (
                      <div className='mx-1.5'>
                        <span className='text-3xl'>{minutes}</span>
                        <span className='text-xl'>m</span>
                      </div>
                    )}
                  </div>
                  <DateEndComponent />
                </div>
              )}

            {/* Future event */}
            {DateUtil.isFutureOutsideRange(event.start, new Date()) &&
              !DateUtil.isEqual(event.start, new Date()) && (
                <div className='flex flex-col gap-1 p-5 rounded-md bg-purple-100'>
                  <div className='text-xs'>STARTS ON</div>
                  <div className='flex items-end gap-x-1'>
                    <span className='text-3xl'>
                      {DateTime.fromMillis(event.start).toFormat('dd')}
                    </span>
                    <span className='uppercase'>
                      {DateTime.fromMillis(event.start).toFormat('MMMM')}
                    </span>
                  </div>
                  <div className='text-gray-500'>
                    {DateTime.fromMillis(event.start).toFormat('cccc t')}
                    {/* cccc t = Monday 12:00 AM */}
                  </div>
                </div>
              )}
          </div>
        </>
      )}
    </ModalOverlay>
  );
};
