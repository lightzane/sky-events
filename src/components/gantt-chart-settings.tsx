import {
  LucideCheck,
  LucideCopy,
  LucideDownload,
  LucideEye,
  LucideRefreshCcw,
  LucideUpload,
} from 'lucide-react';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { cn, preYaml, toYaml } from '../shared/utils';
import ModalOverlay from './modal-overlay';
import { Event } from '../data';
import DatePicker from './date-picker';

type Props = {
  show: boolean;
  currentDateInput?: Date;
  onClose?: () => void;
  onDataReset: () => void;
  onDataImport: () => void;
  onDataExport: () => void;
  onViewRaw: () => void;
  onCurrentDate: (date: Date) => void;
  toggleWeeks: (numOfDays: number) => void;
};

export default ({
  show,
  currentDateInput,
  onClose,
  onCurrentDate,
  onDataReset,
  onDataImport,
  onDataExport,
  onViewRaw,
  toggleWeeks,
}: Props) => {
  const [numOfDays, setNumOfDays] = useState(7);
  const [copied, setCopied] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    currentDateInput || new Date(),
  );

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setShowDatePicker(false);
  }, [show]);

  useEffect(() => {
    onCurrentDate(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (
      currentDateInput &&
      currentDateInput.setHours(0, 0, 0, 0) !== currentDate.setHours(0, 0, 0, 0)
    ) {
      setCurrentDate(currentDateInput);
    }
  }, [currentDateInput]);

  useEffect(() => {
    toggleWeeks?.(numOfDays);
  }, [numOfDays]);

  useEffect(() => {
    let copyTimeout: ReturnType<typeof setTimeout>;

    if (copied) {
      copyTimeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => clearTimeout(copyTimeout);
  }, [copied]);

  function handleCopyTemplate() {
    setCopied(true);

    const template: Partial<Event>[] = [
      {
        name: 'Season of Sanctuary',
        start: DateTime.now().minus({ days: 2 }).toMillis(),
        end: DateTime.now().plus({ days: 3 }).toMillis(),
        imageUrl:
          'https://img2.storyblok.com/fit-in/0x1200/filters:format(webp)/f/108104/4800x2700/90a0601dba/2_prairie_7d7846757a.jpeg',
      },
      {
        name: 'Season of Trials',
        start: DateTime.now().minus({ days: 2 }).toMillis(),
        end: DateTime.now().minus({ days: 1 }).toMillis(),
      },
      {
        name: 'Season of Future',
        start: DateTime.now().plus({ days: 25 }).toMillis(),
        end: DateTime.now().plus({ days: 30 }).toMillis(),
        time: {
          start: '# Optional. Default 12am',
          end: '# Optional. Default 11:59pm',
        },
      },
      {
        name: 'Season of Aurora',
        start: DateTime.now().minus({ days: 25 }).toMillis(),
        end: DateTime.now().minus({ days: 1 }).toMillis(),
        time: {
          start: '10am PDT',
          end: '23:59 PDT',
        },
      },
    ];

    // @ts-expect-error Since fields such as "id" is skipped for yaml
    let yml = toYaml(preYaml(template));
    const lines = yml.split('\n');
    lines.shift(); // remove first line
    yml = lines.join('\n');

    navigator.clipboard.writeText(yml);
  }

  return (
    <ModalOverlay
      className='w-full md:max-w-xs'
      showModal={show}
      onClose={() => onClose?.()}>
      <div className='flex flex-col gap-y-1'>
        {/* Data */}
        <div className='font-semibold'>Data</div>
        <div className='flex flex-col py-5 px-3 gap-y-2'>
          <div className='flex items-center gap-x-1'>
            {/* Reset */}
            <button
              type='button'
              onClick={() => {
                onDataReset();
                setCurrentDate(new Date());
              }}
              className='shadow-sm flex flex-1 items-center gap-x-1 text-sm px-3 py-1 rounded-lg transition ease-in-out duration-300 outline-none hover:bg-blue-400 text-white bg-blue-500'>
              <LucideRefreshCcw className='w-4 h-4' />
              <span>Reset</span>
            </button>

            {/* Import */}
            <button
              type='button'
              onClick={onDataImport}
              className='shadow-sm flex flex-1 items-center gap-x-1 text-sm px-3 py-1 rounded-lg transition ease-in-out duration-300 outline-none hover:bg-emerald-400 text-white bg-emerald-500'>
              <LucideUpload className='w-4 h-4' />
              <span>Import</span>
            </button>

            {/* Export */}
            <button
              type='button'
              onClick={onDataExport}
              className='shadow-sm flex flex-1 items-center gap-x-1 text-sm px-3 py-1 rounded-lg transition ease-in-out duration-300 outline-none hover:bg-gray-700 text-white bg-gray-950'>
              <LucideDownload className='w-4 h-4' />
              <span>Export</span>
            </button>
          </div>

          {/* View Raw */}
          <button
            type='button'
            onClick={onViewRaw}
            className='shadow-sm flex justify-center items-center gap-x-1 text-sm px-3 py-1 rounded-lg transition ease-in-out duration-300 outline-none bg-gradient-to-b from-white from-10% to-gray-100 ring-1 ring-gray-300 opacity-70 hover:opacity-100'>
            <LucideEye className='w-4 h-4' />
            <span>View Raw</span>
          </button>

          {/* Copy Template */}
          <button
            type='button'
            onClick={handleCopyTemplate}
            className={cn(
              'shadow-sm flex justify-center items-center gap-x-1 text-sm px-3 py-1 rounded-lg transition ease-in-out duration-300 outline-none bg-gradient-to-b from-white from-10% to-gray-100 ring-1 ring-gray-300 opacity-70 hover:opacity-100',
              { 'disabled:to-white ring-0 shadow-none': copied },
            )}
            disabled={copied}>
            {!copied ? (
              <>
                <LucideCopy className='w-4 h-4' />
                <span>Template</span>
              </>
            ) : (
              <>
                <LucideCheck className='w-4 h-4 text-emerald-500' />
                <span>Copied</span>
              </>
            )}
          </button>
        </div>

        {/* Current Date */}
        <div className='font-semibold'>Current Date</div>
        <div className='flex items-center justify-center gap-x-1 py-5 px-3'>
          <button
            type='button'
            className='px-3 py-1 hover:ring-2 hover:ring-blue-500 rounded-lg'
            onClick={() => setShowDatePicker(true)}>
            {DateTime.fromJSDate(new Date(currentDate)).toFormat('yyyy-MM-dd')}
          </button>

          <ModalOverlay
            withPlate={false}
            showModal={showDatePicker}
            onClose={() => setShowDatePicker(false)}>
            <DatePicker
              defaultDate={new Date(currentDate)}
              onClose={() => setShowDatePicker(false)}
              show={showDatePicker}
              onDatePicked={(date) => setCurrentDate(date)}
            />
          </ModalOverlay>
        </div>

        {/* Toggle Weeks */}
        <div className='font-semibold'>Weeks</div>
        <div className='flex items-center gap-x-2 py-5 px-3'>
          <button
            type='button'
            onClick={() => setNumOfDays(7)}
            className={cn(
              'text-sm px-3 py-1 rounded-lg opacity-50 transition ease-in-out duration-300 outline-none hover:bg-sky-200 hover:opacity-100',
              {
                'ring-2 ring-sky-500 bg-sky-100 opacity-100': numOfDays === 7,
              },
            )}>
            1 week
          </button>
          <button
            type='button'
            onClick={() => setNumOfDays(21)}
            className={cn(
              'text-sm px-3 py-1 rounded-lg opacity-50 transition ease-in-out duration-300 outline-none hover:bg-sky-200 hover:opacity-100',
              {
                'ring-2 ring-sky-500 bg-sky-100 opacity-100': numOfDays === 21,
              },
            )}>
            3 weeks
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};
