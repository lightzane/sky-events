import { useEffect, useState } from 'react';
import { Event } from '../data';
import { cn } from '../shared/utils';
import { LucideX } from 'lucide-react';

type Props = {
  events: Event[];
  onTagsChanged: (tags: string[]) => void;
};

export default ({ events, onTagsChanged }: Props) => {
  const [tags, setTags] = useState<string[]>([]);
  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    const availableTags: string[] = [];

    events
      .filter((e) => e.end > Date.now())
      .forEach((event) => {
        if (!event.tags?.length) {
          return;
        }

        event.tags.forEach((tag) => {
          if (!availableTags.includes(tag)) {
            availableTags.push(tag);
          }
        });
      });

    setTags(availableTags);
    setFilters(availableTags); // initial filter everything
  }, [events]);

  useEffect(() => {
    onTagsChanged(filters);
  }, [filters]);

  function addFilter(tag: string) {
    const currentFilter = [...filters];
    if (filters.includes(tag)) {
      setFilters(filters.filter((f) => f !== tag));
    } else {
      currentFilter.push(tag);
      setFilters(currentFilter);
    }
  }

  function removeFilter(tag: string) {
    setFilters(filters.filter((f) => f !== tag));
  }

  return (
    <div className='px-1 pb-3'>
      <div className='flex flex-col gap-y-5'>
        <h2 className='font-lg'>Filters</h2>
        <div>
          <div className='p-5 max-h-52 overflow-y-auto'>
            <div className='flex gap-x-3'>
              {filters.map((tag) => (
                <button
                  key={tag}
                  className={cn(
                    'rounded-3xl p-1.5 px-3 bg-gray-100 sm:text-sm font-semibold animate-enter shadow-sm',
                    'flex gap-x-1',
                  )}
                  onClick={() => removeFilter(tag)}>
                  <LucideX size={20} className='text-gray-400' />
                  <span>{tag}</span>
                </button>
              ))}
              {!filters.length && (
                <div className='p-1.5 px-3 sm:text-sm text-gray-400'>
                  Displaying all events without tags
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <h3>Available tags</h3>
          <div className='p-5 min-h-52 max-h-52 overflow-y-auto'>
            <div className='flex gap-x-3'>
              {tags.map((tag) => (
                <button
                  key={tag}
                  className={cn(
                    'rounded-3xl p-1.5 px-3 bg-gray-100 sm:text-sm',
                    'hover:bg-sky-300 transition duration-300 ease-in-out',
                    {
                      '!bg-blue-500 !text-white font-semibold shadow-md':
                        filters.includes(tag),
                    },
                  )}
                  onClick={() => addFilter(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
