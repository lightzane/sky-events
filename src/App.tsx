// https://www.youtube.com/watch?v=s4_ARM8KBm0

import './App.css';
import GanttChart from './components/(gantt-chart)/gantt-chart';
import { EVENTS } from './data';

export default () => {
  return (
    <div>
      <div className='my-5 md:m-5'>
        <GanttChart events={EVENTS} />
      </div>
    </div>
  );
};
