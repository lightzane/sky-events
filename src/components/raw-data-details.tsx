import { Event } from '../data';
import { preYaml, toYaml } from '../shared/utils';
import ModalOverlay from './modal-overlay';

type Props = {
  events: Event[];
  show: boolean;
  onClose: () => void;
};

export default ({ events, show, onClose }: Props) => {
  function rawContent() {
    // @ts-expect-error Since fields became partial
    let yml = toYaml(preYaml(events));

    const lines = yml.split('\n');

    // remove first line (as it is just an export timestamp)
    lines.shift();

    return lines.join('\n');
  }

  return (
    <ModalOverlay
      className='max-w-7xl pr-10'
      showModal={show}
      onClose={onClose}>
      <div className='max-h-[70svh] overflow-auto'>
        <pre>{rawContent()}</pre>
      </div>
    </ModalOverlay>
  );
};
