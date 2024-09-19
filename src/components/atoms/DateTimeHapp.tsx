'use client';
import cls from 'classnames';
import { InputHTMLAttributes, memo, useState } from 'react';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { LuClock10 } from 'react-icons/lu';
import MiniCalendar from './MiniCalendarHapp';
import MiniClock from './MiniClockHapp';

interface DateTimeHappProps extends InputHTMLAttributes<HTMLInputElement> {
  className: string;
  happedAt: Date | undefined;
  setHappedAt: (newDate: Date) => void;
}

const DateTimeHapp: React.FC<DateTimeHappProps> = ({
  className,
  happedAt,
  setHappedAt,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClock, setShowClock] = useState(false);

  return (
    <div className={`flex py-1 gap-1 ${className}`}>
      <div className="w-1/2 px-3 border rounded flex justify-end items-center text-gray-400 gap-3">
        <span className="text-lg text-gray-600">
          {happedAt && happedAt.toDateString()}
        </span>
        <IoCalendarNumberSharp
          onClick={() => setShowCalendar(!showCalendar)}
          className={cls('p-[1px] hover:bg-gray-100 rounded', {
            'text-primary hover:bg-primary-hover': showCalendar,
          })}
        />
        {showCalendar && happedAt && (
          <MiniCalendar
            className="absolute shadow-md p-1 -translate-y-24 bg-white border border-1 border-gray-transparent rounded-md delay-0 duration-150 transition-colors ease-in-out"
            happedAt={happedAt}
            setHappedAt={setHappedAt}
          />
        )}
      </div>
      <div className="w-1/2 px-3 border rounded flex justify-end items-center text-gray-400 gap-3">
        <span className="text-lg text-gray-600">
          {happedAt && happedAt.getHours()}
        </span>
        <LuClock10
          onClick={() => setShowClock(!showClock)}
          className={cls('p-[1px] hover:bg-gray-100 rounded', {
            'text-primary hover:bg-primary-hover': showClock,
          })}
        />
        {showClock && happedAt && (
          <MiniClock
            className="-translate-y-20 -translate-x-8"
            happedAt={happedAt}
            setHappedAt={setHappedAt}
          />
        )}
      </div>
    </div>
  );
};

export default memo(DateTimeHapp);
