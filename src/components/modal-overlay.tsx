import { ReactNode, useEffect } from 'react';
import { cn } from '../shared/utils';
import { LucideX } from 'lucide-react';

type Props = {
  showModal: boolean;
  children?: ReactNode;
  onClose?: () => void;
  className?: string;
};

export default ({ showModal, children, onClose, className }: Props) => {
  useEffect(() => {
    if (showModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [showModal]);

  return (
    <div className='relative z-20 pointer-events-none'>
      {/* Overlay */}
      <div
        role='button'
        onClick={() => onClose?.()}
        className={cn(
          'fixed inset-0 flex items-end justify-center cursor-pointer',
          'transition ease-in-out duration-500',
          { 'pointer-events-auto bg-gray-700/10': showModal },
          // { 'pointer-events-auto bg-white/10 backdrop-blur-sm': showModal },
        )}></div>

      {/* Content */}
      <div className='fixed inset-0 flex items-center justify-center'>
        <div
          className={cn(
            'relative rounded-lg w-full max-w-xl bg-white shadow-2xl cursor-default p-3',
            'transition-all ease-in-out duration-300',
            {
              'opacity-0 translate-y-20': !showModal,
              'translate-y-0 pointer-events-auto': showModal,
            },
            className,
          )}>
          <div className='absolute right-0 pr-3'>
            <button
              type='button'
              className='text-gray-300 hover:text-gray-900 transition ease-in-out duration-300'
              onClick={() => onClose?.()}>
              <LucideX />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
