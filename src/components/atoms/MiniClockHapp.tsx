'use client';
import cls from 'classnames';
import { memo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx/index';
import dateUtils from '@/utils/date.util';

interface MiniClockProps {
  className: string;
  time: Date | undefined;
  setTime: (e: Date) => void;
}

enum MeridiemEnum {
  AM = 0,
  PM = 1,
}

const MiniClock: React.FC<MiniClockProps> = ({
  className,
  time,
  setTime,
}) => {
  const [hour, setHour] = useState(time ? time.getHours() : 0);
  const [minutes, setMinutes] = useState(time ? time.getMinutes() : 0);
  const [meridiem, setMeridiem] = useState(hour >= 12 ? MeridiemEnum.PM : MeridiemEnum.AM);

  const center = { x: 79, y: 79 }; // Clock center position
  const radiusHour = 53; // Radius for clock's circle layout
  const radiusMinute = 78; // Radius for clock's circle layout
  const angleStepHour = (2 * Math.PI) / 24; // Clock angle step for hours
  const angleStepMinutes = (2 * Math.PI) / 60; // Angle step for minutes (60 divisions)

  // Calculate position for hours
  const getPositionHours = (angle: number) => ({
    x: center.x + radiusHour * Math.cos(angle),
    y: center.y + radiusHour * Math.sin(angle),
  });

  // Calculate position for minutes
  const getPositionMinutes = (angle: number) => ({
    x: center.x + radiusMinute * Math.cos(angle),
    y: center.y + radiusMinute * Math.sin(angle),
  });

  const setNewHour = (i: number) => {
    if (time) {
      const newTime = new Date(time);
      newTime.setHours(i);
      setTime(newTime);
      setMeridiem(i >= 12 ? MeridiemEnum.PM : MeridiemEnum.AM);
      setHour(i);
    }
  };

  const setNewMinutes = (i: number) => {
    if (time) {
      const newTime = new Date(time);
      newTime.setMinutes(i);
      setTime(newTime);
      setMinutes(i);
    }
  };

  return (
    <div
      className={`absolute w-[180px] h-[180px] m-1 rounded-full bg-white shadow-md ${className}`}
    >
      <div className="absolute inset-0 flex justify-center items-center">
        {/* Hour selection */}
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i - 6) * angleStepHour;
          const position = getPositionHours(angle);
          return (
            <div
              key={i}
              className="absolute"
              style={{ top: `${position.y}px`, left: `${position.x}px` }}
            >
              <div
                className={cls(
                  'h-6 w-6 rounded-full hover:bg-gray-100 group', 
                  'flex justify-center items-center cursor-pointer',
                  'bg-green-100 rounded-full',
                  'z-10'
                )}
                onClick={() => setNewHour(i)}
              >
                { hour === i && (
                  <span className={cls(
                    'h-6 w-6 rounded-full text-lg font-bold',
                    'flex justify-center items-center',
                    'bg-green-700 text-white',
                    'z-20'
                  )}>
                    {i}
                  </span>
                )}
                { hour !== i && (
                  <div className='z-30'>
                    <span className={cls(
                      'text-lg font-bold group-hover:hidden',
                    )}>
                      {i%3==0 ? i : '・'}
                    </span>
                    <span className={cls(
                      'text-lg text-gray-600 font-bold hidden group-hover:block',
                    )}>
                      {i}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Minute selection */}
        {Array.from({ length: 60 }, (_, i) => {
          const angle = (i - 15) * angleStepMinutes;
          const position = getPositionMinutes(angle);
          return (
            <div
              key={i}
              className="absolute text-xs"
              style={{ top: `${position.y}px`, left: `${position.x}px` }}
            >
              <div
                className={cls(
                  'h-6 w-6 rounded-full hover:bg-gray-100 group', 
                  'flex justify-center items-center cursor-pointer',
                )}
                onClick={() => setNewMinutes(i)}
              >
                { minutes === i && (
                  <span className={cls(
                    'h-6 w-6 rounded-full text-lg font-bold',
                    'flex justify-center items-center',
                    'bg-blue-700 text-white',
                  )}>
                    {i}
                  </span>
                )}
                { minutes !== i && (
                  <div className='z-10'>
                    <span className={cls(
                      'text-lg font-bold group-hover:hidden',
                      'z-30'
                    )}>
                      {i % 5 == 0 ? i : '・'}
                    </span>
                    <span className={cls(
                      'text-lg text-gray-600 font-bold hidden group-hover:block',
                    )}>
                      {i}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className={cls(
          'flex flex-col items-center justify-center', 
          'w-[75px] h-[75px] rounded-full'
        )}>
          { meridiem === MeridiemEnum.AM && (
            <div
              className={cls(
                'text-primary text-base'
              )}
            >
              {Language.$t.Meridiem.AM}
            </div>
          )}
          { meridiem === MeridiemEnum.PM && (
            <div
              className={cls(
                'text-primary text-base'
              )}
            >
              {Language.$t.Meridiem.PM}
            </div>
          )}
          {/* Show Time */}
          {time && (
            <div className='flex'>
              <span className={cls('text-green-700')}>
                {dateUtils.getFormatHour(time)}
              </span>
              :
              <span className={cls('text-blue-700')}>
                {dateUtils.getFormatMin(time)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(observer(MiniClock));
