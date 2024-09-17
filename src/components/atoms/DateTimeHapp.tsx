'use client';
import cls from 'classnames';
import { InputHTMLAttributes, memo, useState } from 'react';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { LuClock10 } from 'react-icons/lu';
import MiniCalendar from './MiniCalendarHapp';
import MiniClock from './MiniClockHapp';

interface DateTimeHappProps extends InputHTMLAttributes<HTMLInputElement> {
  className: string;
  stampedAt: Date | undefined;
  setStampedAt: (newDate: Date) => void;
}

const DateTimeHapp: React.FC<DateTimeHappProps> = ({
  className,
  stampedAt,
  setStampedAt,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClock, setShowClock] = useState(false);

  return (
    <div className={`flex py-1 gap-1 ${className}`}>
      <div className="w-1/2 px-3 border rounded flex justify-end items-center text-gray-400 gap-3">
        <span className="text-lg text-gray-600">
          {stampedAt && stampedAt.toDateString()}
        </span>
        <IoCalendarNumberSharp
          onClick={() => setShowCalendar(!showCalendar)}
          className={cls('p-[1px] hover:bg-gray-100 rounded', {
            'text-primary hover:bg-primary-hover': showCalendar,
          })}
        />
        {showCalendar && stampedAt && (
          <MiniCalendar
            className="absolute shadow-md p-1 -translate-y-24 bg-white border border-1 border-gray-transparent rounded-md delay-0 duration-150 transition-colors ease-in-out"
            stampedAt={stampedAt}
            setStampedAt={setStampedAt}
          />
        )}
      </div>
      <div className="w-1/2 px-3 border rounded flex justify-end items-center text-gray-400 gap-3">
        <span className="text-lg text-gray-600">
          {stampedAt && stampedAt.getHours()}
        </span>
        <LuClock10
          onClick={() => setShowClock(!showClock)}
          className={cls('p-[1px] hover:bg-gray-100 rounded', {
            'text-primary hover:bg-primary-hover': showClock,
          })}
        />
        {showClock && stampedAt && (
          <MiniClock
            className="-translate-y-20 -translate-x-8"
            stampedAt={stampedAt}
            setStampedAt={setStampedAt}
          />
        )}
      </div>
    </div>
  );
};

export default memo(DateTimeHapp);
