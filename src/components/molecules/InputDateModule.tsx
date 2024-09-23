'use client';
import cls from 'classnames';
import { memo, useState } from 'react';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import MiniCalendarHapp from '../atoms/MiniCalendarHapp';

interface InputDateModuleProps {
  startTime: Date | undefined;
  setStartTime: (newDate: Date) => void;
}

const InputDateModule: React.FC<InputDateModuleProps> = ({
  startTime,
  setStartTime,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className={cls(
      'w-1/2 px-3 border rounded',
      'flex justify-end items-center text-gray-400 gap-3'
    )}>
      {/* Background opacity */}
      <div
        className="fixed inset-0 w-full h-full z-40 cursor-default"
        onClick={() => setShowCalendar(false)}
      />
      <span className="text-lg text-gray-600">
        {startTime && startTime.toDateString()}
      </span>
      <IoCalendarNumberSharp
        onClick={() => setShowCalendar(!showCalendar)}
        className={cls('p-[1px] hover:bg-gray-100 rounded', {
          'text-primary hover:bg-primary-hover': showCalendar,
        })}
      />
      {showCalendar && startTime && (
        <MiniCalendarHapp
          className="absolute shadow-md p-1 -translate-y-24 bg-white border border-1 border-gray-transparent rounded-md delay-0 duration-150 transition-colors ease-in-out"
          startTime={startTime}
          setStartTime={setStartTime}
        />
      )}
    </div>
  );
};

export default memo(InputDateModule);
