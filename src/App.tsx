import React, { useEffect, useRef, useState } from 'react';

import './App.css';
import GanttChart from './components/(gantt-chart)/gantt-chart';
import AddEvent from './components/add-event';
import EventCardDetails from './components/event-card-details';
import GanttChartSettings from './components/gantt-chart-settings';
import ModalOverlay from './components/modal-overlay';
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
import Filter from './components/filter';

export default () => {
  const [showSettings, setShowSettings] = useState(false);
  const [spanDays, setSpanDays] = useState(7); // default to 1 week
  const [dataInput, setDataInput] = useState(FEATURED_EVENTS); // has the original date IF diff timezone
  const [localized, setLocalized] = useState(FEATURED_EVENTS); // has the converted date to local
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventDetails, setEventDetails] = useState<Event>(); // event to view details
  const [viewRaw, setViewRaw] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const [eventAdded, setEventAdded] = useState(false);
  const [additionalImport, setAdditionalImport] = useState(false);
  const [editEvent, setEditEvent] = useState<Event>();
  const [editEventId, setEditEventId] = useState<string>();
  const [deleteEventId, setDeleteEventId] = useState<string>();

  const fileUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localizedEvents(FEATURED_EVENTS);
  }, []);

  // Detect edit
  useEffect(() => {
    if (editEventId) {
      const event = dataInput.find((e) => e.id === editEventId);
      setEditEventId(undefined);

      if (event) {
        setEditEvent(event);
        setShowAddEvent(true);
      }
    }
  }, [editEventId]);

  // Detect deletion
  useEffect(() => {
    if (deleteEventId) {
      const event = dataInput.find((e) => e.id === deleteEventId);
      setDeleteEventId(undefined);

      if (event) {
        const newList = dataInput.filter((e) => e.id !== event.id);
        localizedEvents(newList);
      }
    }
  }, [deleteEventId]);

  // Detect dataInput
  useEffect(() => {
    if (eventAdded) {
      setEventAdded(false);
      handleExport();
    }
  }, [dataInput]);

  function toggleSettings() {
    setShowSettings((t) => !t);
  }

  function handleReset() {
    setShowSettings(false);
    localizedEvents(FEATURED_EVENTS);
    setCurrentDate(new Date());
  }

  function handleExport() {
    if (!dataInput.length) {
      return;
    }
    download(preYaml(dataInput));
  }

  function handleImport(additional = false) {
    fileUploadRef.current?.click();
    setAdditionalImport(additional);
  }

  function handleViewRaw() {
    if (eventDetails || !dataInput.length) {
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
        const eventDate = new Date(event[whichTime]);

        validated = TimeZoneValidator.validate(
          time[whichTime],
          eventDate.getFullYear(),
        );

        const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
        const day = eventDate.getDate();
        const monthDay = `${month} ${day}`;

        if (!hasError(validated)) {
          const iso = TimeZoneUtil.getLocalTime(
            `${monthDay}, ${time[whichTime]}`,
            eventDate,
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
    const currentList = [...dataInput].map((event) => ({ ...event }));

    upload(e, fileUploadRef, (uploadedEvents) => {
      if (additionalImport) {
        uploadedEvents.push(...currentList);
      }
      localizedEvents(uploadedEvents);
      setShowSettings(false);
      setShowAddEvent(false);
      setAdditionalImport(false); // reset
    });
  }

  function handleChangeDate(date: Date) {
    setCurrentDate(date);
  }

  function handleClearData() {
    localizedEvents([]);
    setShowSettings(false);
  }

  function moveCurrentDate(where: 'prev' | 'next') {
    if (where === 'prev') {
      setCurrentDate((c) => new Date(c.setDate(c.getDate() - 1)));
    }

    // next
    else if (where === 'next') {
      setCurrentDate((c) => new Date(c.setDate(c.getDate() + 1)));
    }
  }

  return (
    <div>
      <div className='md:my-5 md:m-5'>
        <div className='flex flex-col gap-y-10'>
          <GanttChart
            events={localized}
            filters={filters}
            addClick={() => setShowAddEvent(true)}
            filterClick={() => setShowFilter(true)}
            settingsClick={toggleSettings}
            spanDaysInput={spanDays}
            currentDate={currentDate}
            onPrevDayClick={() => moveCurrentDate('prev')}
            onNextDayClick={() => moveCurrentDate('next')}
            onEventClick={setEventDetails}
          />

          <GanttChartSettings
            dataInput={dataInput}
            show={showSettings}
            currentDateInput={currentDate}
            onClose={toggleSettings}
            onDataReset={handleReset}
            onDataImport={() => handleImport()}
            onDataExport={handleExport}
            onViewRaw={handleViewRaw}
            onCurrentDate={handleChangeDate}
            onClearData={handleClearData}
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
            onEdit={(eventId) => {
              setTimeout(() => {
                setEventDetails(undefined);
                setEditEventId(eventId);
              }, 500);
            }}
            onDelete={(eventId) => {
              setDeleteEventId(eventId);
              setTimeout(() => {
                setEventDetails(undefined);
              }, 500);
            }}
          />

          {/* View Raw Details */}
          <RawDataDetails
            events={dataInput}
            show={viewRaw}
            onClose={() => setViewRaw(false)}
          />

          {/* Add/Edit Event */}
          <ModalOverlay
            className='max-w-md'
            showModal={showAddEvent}
            onClose={() => {
              setShowAddEvent(false);
              setEditEvent(undefined);
              setEditEventId(undefined);
            }}>
            <AddEvent
              editEvent={editEvent}
              onDateChanged={(date) => setCurrentDate(date)}
              onImportClick={() => handleImport(true)}
              onSubmit={(event, update) => {
                setEventAdded(true); // see useEffect that may trigger

                const newlist = [...dataInput].map((event) => ({ ...event }));

                if (update) {
                  const existingIdx = newlist.findIndex(
                    (e) => e.id === event.id,
                  );

                  if (existingIdx >= 0) {
                    newlist[existingIdx] = event;
                  }

                  setEditEvent(undefined);
                  setEditEventId(undefined);
                }
                // New Event
                else {
                  newlist.unshift(event);
                }

                localizedEvents(newlist);
                setShowAddEvent(false);
              }}
            />
          </ModalOverlay>

          {/* Filter */}
          <ModalOverlay
            showModal={showFilter}
            onClose={() => setShowFilter(false)}>
            <Filter
              events={localized}
              onTagsChanged={(tags) => setFilters(tags)}
            />
          </ModalOverlay>
        </div>
      </div>
    </div>
  );
};
