'use client';
import cls from 'classnames';
import { memo, useState } from 'react';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import MiniCalendarHapp from '../atoms/MiniCalendarHapp';
import { LuClock10 } from 'react-icons/lu';
import MiniClockHapp from '../atoms/MiniClockHapp';
import DateUtils from '@/utils/date.util';
import { Language } from '@/mobx';

interface Props {
  className?: string;
  startTime?: Date | undefined;
  setStartTime?: (e: Date) => void;
}

const InputDateTimeModule: React.FC<Props> = ({
  className,
  startTime,
  setStartTime,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClock, setShowClock] = useState(false);

  const getMonthYearString = () => {
    if (startTime) {
      const month = startTime.getMonth() + 1;
      const year = startTime.getFullYear();
      const date = startTime.getDate();
      return ` ${month}/${date} ${year}`;
    }
  };

  return (
    <div className={`flex py-1 gap-1 ${Language.logoFont} ${className}`}>
      <div className={cls(
        'w-3/5 pr-2 border rounded',
        'flex justify-end items-center text-gray-400'
      )}>
        <div 
          className={cls(
            'flex items-center gap-1'
          )}
        >
          <span className="text-lg text-gray-600 p-1">
            { getMonthYearString() }
          </span>
          <IoCalendarNumberSharp
            onClick={() => setShowCalendar(!showCalendar)}
            className={cls('p-[1px] hover:bg-gray-100 rounded', {
              'text-primary hover:bg-primary-hover': showCalendar,
            })}
          />
        </div>
        {showCalendar && startTime && setStartTime && (
          <div>
            {/* Background opacity */}
            <div
              className="fixed inset-0 w-full h-full z-40 cursor-default"
              onClick={() => setShowCalendar(false)}
            />  
            <MiniCalendarHapp
              className={cls(
                'z-50',
                'delay-0 duration-150 transition-colors ease-in-out',
                '-translate-x-[180px] -translate-y-[208px]'
              )}
              startTime={startTime}
              setStartTime={setStartTime}
            />
          </div>
        )}
      </div>
      <div 
        className={cls(
          'w-2/5 pr-2 border rounded',
          'flex justify-end items-center text-gray-400',
        )}
      >
        <div 
          className={cls(
            'flex items-center gap-1'
          )}
        >
          <span className="text-lg text-gray-600">
            {startTime && DateUtils.getFormatHourMin(startTime)}
          </span>
          <LuClock10
            className={cls('p-[1px] hover:bg-gray-100 rounded', {
              'text-blue-700 hover:bg-primary-hover': showClock,
            })}
            onClick={() => setShowClock(true)}
          />
        </div>
        {showClock && startTime && setStartTime && (
          <div className=''>
            {/* Background opacity */}
            <div
              className="fixed inset-0 w-full h-full z-40 cursor-default"
              onClick={() => setShowClock(false)}
            />
            <MiniClockHapp
              className={cls(
                'z-50',
                '-translate-x-[200px] -translate-y-[200px]'
              )}
              time={startTime}
              setTime={setStartTime}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(InputDateTimeModule);
