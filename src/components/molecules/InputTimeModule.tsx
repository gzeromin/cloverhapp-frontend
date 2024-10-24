'use client';
import cls from 'classnames';
import { memo, useState } from 'react';
import { LuClock10 } from 'react-icons/lu';
import MiniClock from '../atoms/MiniClockHapp';
import DateUtils from '@/utils/date.util';

interface InputTimeModuleProps {
  className?: string;
  time: Date | undefined;
  setTime: (e: Date) => void;
}

const InputTimeModule: React.FC<InputTimeModuleProps> = ({
  className,
  time,
  setTime,
}) => {
  const [showClock, setShowClock] = useState(false);
  return (
    <div 
      className={cls(
        'flex justify-end items-center text-gray-400',
        className
      )}
    >
      <div 
        className={cls(
          'flex items-center gap-1'
        )}
      >
        <div className="text-lg text-gray-600 cursor-default">
          {time && DateUtils.getFormatHourMin(time)}
        </div>
        <LuClock10
          className={cls(
            'p-[1px] hover:bg-gray-100 rounded cursor-pointer', {
              'text-blue-700 hover:bg-primary-hover': showClock,
            }
          )}
          onClick={() => setShowClock(true)}
        />
      </div>
      {showClock && time && (
        <div className=''>
          {/* Background opacity */}
          <div
            className="fixed inset-0 w-full h-full z-40 cursor-default"
            onClick={() => setShowClock(false)}
          />
          <MiniClock
            className={cls(
              'z-50',
              'delay-0 duration-150 transition-colors ease-in-out',
              '-translate-x-[200px] -translate-y-[200px]'
            )}
            time={time}
            setTime={setTime}
          />
        </div>
      )}
    </div>
  );
};

export default memo(InputTimeModule);
