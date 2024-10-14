'use client';
import cls from 'classnames';
import { memo, useState } from 'react';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import MiniCalendarHapp from '../atoms/MiniCalendarHapp';

interface Props {
  className?: string;
  startTime?: Date | undefined;
  setStartTime?: (e: Date) => void;
}

const InputDateModule: React.FC<Props> = ({
  className,
  startTime,
  setStartTime,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const getMonthYearString = () => {
    if (startTime) {
      const month = startTime.getMonth() + 1;
      const year = startTime.getFullYear();
      const date = startTime.getDate();
      return ` ${month}/${date} ${year}`;
    }
  };

  return (
    <div className={cls(
      'flex justify-end items-center text-gray-400',
      className
    )}>
      <div className={cls(
        'flex items-center gap-1'
      )}>
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
              '-translate-x-44',
            )}
            startTime={startTime}
            setStartTime={setStartTime}
          />
        </div>
      )}
      
    </div>
  );
};

export default memo(InputDateModule);
