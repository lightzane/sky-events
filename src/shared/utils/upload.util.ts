import React from 'react';

import yaml from 'yaml';
import { Event } from '../../data';
import { TimeRegexUtil } from './time-regex.util';
import { uuid } from './uuid';

export function upload(
  e: React.ChangeEvent<HTMLInputElement>,
  fileUploadRef: React.RefObject<HTMLInputElement>,
  onComplete: (events: Event[]) => void,
) {
  const { currentTarget } = e;
  const { files: uploadedFiles } = currentTarget;
  const events: Event[] = [];

  let numValidatedFiles = 0;

  /** Prep function to handle asynchronous flow and listen to completion */
  const resolveUpload = (fileReader: FileReader, error?: boolean) => {
    // First: Wait for all files to be processed and validated
    if (numValidatedFiles !== uploadedFiles?.length) {
      return;
    }

    // Enable to re-process uploaded file with same filename (even though contents changed)
    if (fileUploadRef.current) {
      fileUploadRef.current.value = '';
    }

    // Remove the event handler to release the reference
    fileReader.onload = null;

    if (!error && numValidatedFiles === 1) {
      console.log('One YAML file imported successfully!');
    }

    if (numValidatedFiles > 1) {
      console.log('YAML files imported successfully!');
    }

    // Consolidate and show the list to user (save to localStorage and get later after refesh)
    // if (idsImported.length > 1) {
    //   localStorage.setItem(IDS_IMPORTED, JSON.stringify(idsImported));

    //   setTimeout(() => {
    //     toast.success('Shared notes imported');
    //   }, 500);
    // }

    onComplete(events);
  };

  const files = uploadedFiles || [];

  for (const file of files) {
    const fileReader = new FileReader();

    fileReader.readAsText(file, 'utf-8');

    fileReader.onload = (fileLoadedEvent) => {
      numValidatedFiles++;

      const fileContent = fileLoadedEvent.target?.result as string;

      // if (!file.name.match(/\.\b(simple-note|simple-note.json)\b$/)) {
      //   toast.error('File must be .simple-note');
      //   return;
      // }

      /** Contains JSON format */
      let parsedContent: Event[] = [];

      let loadFailed = false;

      try {
        parsedContent = yaml.parse(fileContent);
      } catch {
        loadFailed = true;
      }

      if (!parsedContent || loadFailed) {
        console.error('Failed to parse YAML file');
        resolveUpload(fileReader, true); // with error
        return;
      }

      // *  Content validation here...

      parsedContent = transform(parsedContent);
      events.push(...parsedContent);

      resolveUpload(fileReader);
    };
  }
}

function transform(parsedContent: Event[]): Event[] {
  // const invalidEvents = [];

  // Filter out event objects with complete mandatory fields
  parsedContent = [...parsedContent].filter(
    (event) => event.name && event.start && event.end,
  );

  parsedContent.forEach((event) => {
    event.id = uuid();

    // format date
    event.start = +new Date(event.start);
    event.end = +new Date(event.end);

    const { time } = event;

    if (time?.start) {
      const h = TimeRegexUtil.getHour(time.start) || 0;
      const m = TimeRegexUtil.getMinute(time.start) || 0;
      event.start = +new Date(event.start).setHours(h, m);

      // Try Convert to local time if different timezone
      // try {
      //   const outputISOString = TimeZoneUtil.getLocalTime(
      //     time.start,
      //     new Date(event.start),
      //     true,
      //   );

      //   event.start = +new Date(outputISOString);
      // } catch (err) {
      //   // @ts-ignore
      //   console.error(err.message);
      // }
    }

    if (time?.end) {
      const h = TimeRegexUtil.getHour(time.end) || 23;
      const m = TimeRegexUtil.getMinute(time.end) || 59;
      event.end = +new Date(event.end).setHours(h, m);

      // Try Convert to local time if different timezone
      // try {
      //   const outputISOString = TimeZoneUtil.getLocalTime(
      //     time.end,
      //     new Date(event.end),
      //     true,
      //   );

      //   event.end = +new Date(outputISOString);
      // } catch (err) {
      //   // @ts-ignore
      //   console.error(err.message);
      // }
    }
  });

  return parsedContent;
}
