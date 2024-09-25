import { Event } from '../../data';
import { DateUtil } from './date.util';

export function download<T>(globalData: T, filename = 'events.yaml') {
  // const data = JSON.stringify(globalData);
  // const data = yaml.dump(globalData);
  const data = toYaml(globalData as Event[]);

  // Create element <a> tag
  const download = document.createElement('a');
  download.style.display = 'none';
  // Set filename when downloading
  download.setAttribute('download', filename);
  // Set content
  download.setAttribute(
    'href',
    // ? MIME stands for "Multipurpose Internet Mail Extensions."
    // * For TXT only
    // 'data:text/plain;charset=utf-8,' + encodeURIComponent(data)

    // * For JSON only
    // 'data:application/json;charset=utf-8,' + encodeURIComponent(data)

    // * For YAML only
    'data:application/x-yaml;charset=utf-8,' + encodeURIComponent(data),
  );
  // Append the element to the body
  document.body.appendChild(download);
  // Simulate click
  download.click();
  // Remove the element
  document.body.removeChild(download);
}

/** Transforms the data (i.e. date format in `yaml`) before converting to `yaml` */
export function preYaml(dataInput: Event[]) {
  return dataInput.map(({ name, start, end, time, imageUrl, tags }) => ({
    name,
    start: DateUtil.formatDateLong(start),
    end: DateUtil.formatDateLong(end),
    time,
    tags,
    imageUrl,
  }));
}

export function toYaml(events: Event[]): string {
  const today = new Date().toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  let yamlStr = `# Events exported as of ${today}`;

  const wrapQuotes = (value: string) => {
    if (/[^a-zA-Z0-9\s]/.test(value)) {
      return `"${value}"`;
    }

    return value;
  };

  events.forEach(({ name, start, end, time, imageUrl, tags }) => {
    // Special characters in name, then wrap in double quotes
    name = wrapQuotes(name);

    // * Mandatory fields
    yamlStr += `
- name: ${name}
  start: ${start}
  end: ${end}
`;

    // * Optional fields
    if (time && (time.start || time.end)) {
      // 2 tab/spaces = Level 1 field
      yamlStr += `  time:`;

      // 4 tab/spaces = Level 2 field
      if (time.start) {
        yamlStr += `\n    start: ${time.start}`;
      }

      if (time.end) {
        yamlStr += `\n    end: ${time.end}`;
      }

      yamlStr += `\n`;
    }

    // * Tags
    if (tags?.length) {
      yamlStr += `  tags:`;
      tags.forEach((tag) => {
        yamlStr += `\n    - ${tag}`;
      });
      yamlStr += `\n`;
    }

    // * Image Url
    if (imageUrl) {
      yamlStr += `  imageUrl: >-
    ${imageUrl}
    `;
    }
  });

  return yamlStr;
}
