import React, { useEffect, useRef, useState } from 'react';

import './App.css';
import GanttChart from './components/(gantt-chart)/gantt-chart';
import EventCardDetails from './components/event-card-details';
import GanttChartSettings from './components/gantt-chart-settings';
import RawDataDetails from './components/raw-data-details';
import { Event, FEATURED_EVENTS } from './data';
import {
  download,
  preYaml,
  TimeRegexUtil,
  TimeZoneUtil,
  upload,
} from './shared/utils';
import { TimeZoneValidator } from './shared/validators';

export default () => {
  const [showSettings, setShowSettings] = useState(false);
  const [spanDays, setSpanDays] = useState(7); // default to 1 week
  const [dataInput, setDataInput] = useState(FEATURED_EVENTS); // has the original date IF diff timezone
  const [localized, setLocalized] = useState(FEATURED_EVENTS); // has the converted date to local
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventDetails, setEventDetails] = useState<Event>(); // event to view details
  const [viewRaw, setViewRaw] = useState(false);

  const fileUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localizedEvents(FEATURED_EVENTS);
  }, []);

  function toggleSettings() {
    setShowSettings((t) => !t);
  }

  function handleReset() {
    setShowSettings(false);
    localizedEvents(FEATURED_EVENTS);
    setCurrentDate(new Date());
  }

  function handleExport() {
    download(preYaml(dataInput));
  }

  function handleImport() {
    fileUploadRef.current?.click();
  }

  function handleViewRaw() {
    if (eventDetails) {
      return;
    }
    setShowSettings(false);
    setViewRaw(true);
  }

  function convertToLocal(event: Event, whichTime: 'start' | 'end') {
    const { time } = event;

    const applyDefaultTime = () => {
      if (!event.time) {
        event.time = {};
      }

      if (!event.time[whichTime]) {
        event.time[whichTime] = whichTime === 'start' ? '12am' : '11:59pm';
      }

      const defaultHour = whichTime === 'start' ? 0 : 23;

      let hours = TimeRegexUtil.getHour(event.time[whichTime]) ?? defaultHour; // SonarLint: Prefer using nullish coalescing operator (`??`) instead of af logical or (`||`), as it is a safer operator.
      const minutes = TimeRegexUtil.getMinute(event.time[whichTime]) ?? 0;

      // 24-hour
      if (event.time[whichTime].includes('am') && hours === 12) {
        hours = 0;
      }

      if (event.time[whichTime].includes('pm') && hours !== 12) {
        hours += 12;
      }

      event[whichTime] = new Date(event[whichTime]).setHours(hours, minutes);
    };

    // Time field is missing
    if (!time?.[whichTime]) {
      applyDefaultTime();
      return;
    }

    const hasError = (validated: string) =>
      // SonarLint: Use the "RegExp.exec()" method instead of validated.match(...)
      /not supported|invalid/i.exec(validated);

    // Time field exists
    if (time[whichTime]) {
      let validated = time[whichTime];

      // Valid Timezone is specified
      if (
        TimeRegexUtil.timeZoneAbbr(time[whichTime].replace(/#.*$/, '').trim()) // remove comments if any
      ) {
        validated = TimeZoneValidator.validate(
          time[whichTime],
          new Date(event[whichTime]).getFullYear(),
        );

        if (!hasError(validated)) {
          const iso = TimeZoneUtil.getLocalTime(
            time[whichTime],
            new Date(event[whichTime]),
            true,
          );
          event[whichTime] = +new Date(iso);
        } else {
          // @ts-ignore
          event.error = time[whichTime];
        }
      }

      // No timezone specified
      else {
        applyDefaultTime();
      }
    }
  }

  function localizedEvents(events: Event[]) {
    // Create new copy to not accidentally mutate original input
    const toLocalized = [...events].map((event) => ({ ...event }));

    // Convert to local time
    toLocalized.forEach((event) => {
      convertToLocal(event, 'start');
      convertToLocal(event, 'end');
    });

    setDataInput(events);
    setLocalized(toLocalized);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    upload(e, fileUploadRef, (uploadedEvents) => {
      localizedEvents(uploadedEvents);
      setShowSettings(false);
    });
  }

  function handleChangeDate(date: Date) {
    setCurrentDate(date);
  }

  return (
    <div>
      <div className='md:my-5 md:m-5'>
        <div className='flex flex-col gap-y-10'>
          <GanttChart
            events={localized}
            settingsClick={toggleSettings}
            spanDaysInput={spanDays}
            currentDate={currentDate}
            onEventClick={setEventDetails}
          />

          <GanttChartSettings
            show={showSettings}
            onClose={toggleSettings}
            onDataReset={handleReset}
            onDataImport={handleImport}
            onDataExport={handleExport}
            onViewRaw={handleViewRaw}
            onCurrentDate={handleChangeDate}
            toggleWeeks={(sd) => setSpanDays(sd)}
          />

          {/* Upload */}
          <input
            ref={fileUploadRef}
            className='hidden'
            hidden
            type='file'
            accept='.yaml, .yml'
            multiple
            onChange={(e) => handleFileSelect(e)}
          />

          {/* Event Details */}
          <EventCardDetails
            event={eventDetails}
            onClose={() =>
              setTimeout(() => {
                setEventDetails(undefined);
              }, 500)
            }
          />

          {/* View Raw Details */}
          <RawDataDetails
            events={dataInput}
            show={viewRaw}
            onClose={() => setViewRaw(false)}
          />
        </div>
      </div>
    </div>
  );
};
