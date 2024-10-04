const fs = require('fs');
const { argv } = require('process');
const yaml = require('yaml');

const pathRegYaml = argv[2]; // registered_events.yaml path
const pathRegTs = argv[3]; // registered_events.ts path

let errorMessages = [];

if (!pathRegYaml) {
  console.error(`Missing argument: registered_events.yaml`);
  errorMessages.push('Please specify path for registered_events.yaml');
}

if (!pathRegTs) {
  console.error(`Missing argument: registered_events.ts\n`);
  errorMessages.push('Please specify path for registered_events.ts');
}

if (errorMessages.length) {
  errorMessages.forEach((msg) => console.log(msg));
  console.log(`\nRun the following command:`);
  console.log(
    `npm start -- path/to/registered_events.yaml path/to/registered_events.ts\n`,
  );
  throw new Error('Please fix the errors');
}

// Read and parse the YAML file
const yamlFile = fs.readFileSync(pathRegYaml, 'utf-8');
const newData = yaml.parse(yamlFile);

// Read the registered_events.ts file
let regEventsContent = fs.readFileSync(pathRegTs, 'utf-8');

// Use a regular expression to find the FEATURED_EVENTS declaration
const registeredEventsRegex =
  /export const REGISTERED_EVENTS: Event\[\] = (\[.*?\]);/s;

let existingEvents = [];

// Check if REGISTERED_EVENTS exists in the file
const match = registeredEventsRegex.exec(regEventsContent);

if (match) {
  let existingEventsStr = match[1];
  // Wrap +new Date() and uuid() with double quotes
  existingEventsStr = existingEventsStr.replace(/(uuid\(\))/gm, '"$1"');
  existingEventsStr = existingEventsStr.replace(
    /(\+new Date\(.*?\))/gm,
    '"$1"',
  );

  existingEvents = JSON.parse(existingEventsStr);
  console.log('Existing events:', JSON.stringify(existingEvents, null, 2));
}

const datefy = (data, field) => `+new Date('${data[field]}')`;

// Update dates
newData.events.forEach((data) => {
  // Insert ID
  data.id = 'uuid()';

  // Wrap "new Date()" to date strings
  const fields = ['start', 'end'];

  fields.forEach((field) => {
    if (!data.end) {
      data.end = data.start;
    }

    if (data[field]) {
      data[field] = datefy(data, field);
    }
  });
});

console.log(`Registering events:`, JSON.stringify(newData.events, null, 2));

// Combine existing and new events
const updatedEvents = [...newData.events, ...existingEvents];

// Construct the updated content for FEATURED_EVENTS
const newEventsContentStr = JSON.stringify(updatedEvents, null, 2);

// Replace the existing REGISTERED_EVENTS array with the updated data
regEventsContent = regEventsContent.replace(
  registeredEventsRegex,
  `export const REGISTERED_EVENTS: Event[] = ${newEventsContentStr};`,
);

// Use a regex to match "new Date(...)" with outer quotes and remove it
regEventsContent = regEventsContent.replace(/"(\+new Date\(.*?\))"/gm, '$1');

// Use a regex to match "uuid" with outer quotes and remove it
regEventsContent = regEventsContent.replace(/"(uuid\(\))"/gm, '$1');

// Write back the updated content to events.ts
fs.writeFileSync(pathRegTs, regEventsContent, 'utf-8');

console.log(
  'registered_events.ts has been updated with new content from registered_events.yaml',
);
