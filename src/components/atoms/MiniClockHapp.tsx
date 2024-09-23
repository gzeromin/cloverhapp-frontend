'use client';
import cls from 'classnames';
import { memo, useEffect, useState } from 'react';
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
  const hour = time ? time.getHours() : 0;
  const minutes = time ? time.getMinutes() : 0;
  const [meridiem, setMeridiem] = useState(hour >= 12 ? MeridiemEnum.PM : MeridiemEnum.AM);
  const [newHour, setNewHour] = useState(hour > 12 ? hour - 12 : hour);
  const [newMinutes, setNewMinutes] = useState(minutes);

  useEffect(() => {
    if (time) {
      if (hour >= 12) {
        setMeridiem(MeridiemEnum.PM);
        setNewHour(hour > 12 ? hour - 12 : hour);
      } else {
        setMeridiem(MeridiemEnum.AM);
      }
      setNewMinutes(minutes);
    }
  }, [hour, minutes, time]);

  const center = { x: 88, y: 89 }; // Clock center position
  const radiusHour = 85; // Radius for clock's circle layout
  const radiusMinute = 67; // Radius for clock's circle layout
  const angleStepHour = (2 * Math.PI) / 12; // Clock angle step for hours
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

  const setAM = () => {
    if (!time || !setTime) return;
    const newTime = new Date(time);
    if (hour >= 12) {
      newTime.setHours(hour - 12);
    }
    setTime(newTime);
    setMeridiem(MeridiemEnum.AM);
  };

  const setPM = () => {
    if (!time || !setTime) return;
    const newTime = new Date(time);
    if (hour < 12) {
      newTime.setHours(hour + 12);
    }
    setTime(newTime);
    setMeridiem(MeridiemEnum.PM);
  };

  const changeHour = (newHour: number) => {
    if (!time || !setTime) return;
    const newTime = new Date(time);
    if (meridiem === MeridiemEnum.AM) {
      newTime.setHours(newHour === 12 ? 0 : newHour);
    } else {
      newTime.setHours(newHour === 12 ? 12 : newHour + 12);
    }
    setTime(newTime);
    setNewHour(newHour);
  };

  const changeMinutes = (newMinutes: number) => {
    if (!time || !setTime) return;
    const newTime = new Date(time);
    newTime.setMinutes(newMinutes);
    setTime(newTime);
    setNewMinutes(newMinutes);
  };

  return (
    <div
      className={`absolute w-[200px] h-[200px] m-1 rounded-full bg-white shadow-md ${className}`}
    >
      <div className="absolute inset-0 flex justify-center items-center">
        {/* Hour selection */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i - 2) * angleStepHour;
          const position = getPositionHours(angle);
          return (
            <div
              key={i}
              className="absolute"
              style={{ top: `${position.y}px`, left: `${position.x}px` }}
            >
              <div
                className={cls(
                  'h-6 w-6 rounded-full hover:bg-gray-100 flex justify-center items-center cursor-pointer',
                  {
                    'bg-green-700 text-white hover:bg-primary-hover': newHour === i + 1,
                  },
                )}
                onClick={() => changeHour(i + 1)}
              >
                <span className={cls('text-lg font-bold')}>{i + 1}</span>
              </div>
            </div>
          );
        })}

        {/* Minute selection */}
        {Array.from({ length: 60 }, (_, i) => {
          const angle = (i - 15) * angleStepMinutes;
          const position = getPositionMinutes(angle);
          const minuteValue = i;
          return (
            <div
              key={minuteValue}
              className="absolute text-xs"
              style={{ top: `${position.y}px`, left: `${position.x}px` }}
            >
              <div
                className={cls(
                  'h-6 w-6 rounded-full hover:bg-gray-100 group', 
                  'flex justify-center items-center cursor-pointer',
                )}
                onClick={() => changeMinutes(minuteValue)}
              >
                { newMinutes === minuteValue && (
                  <span className={cls(
                    'h-6 w-6 rounded-full text-lg font-bold',
                    'flex justify-center items-center',
                    'bg-blue-700 text-white hover:bg-primary-hover',
                    'z-0'
                  )}>
                    {i}
                  </span>
                )}
                { newMinutes !== minuteValue && (
                  <div className='z-10'>
                    <span className={cls(
                      'text-lg font-bold group-hover:hidden'
                    )}>
                      {i%10==0 ? i : '・'}
                    </span>
                    <span className={cls(
                      'text-lg text-gray-600 font-bold hidden group-hover:block'
                    )}>
                      {i}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className={cls('flex flex-col items-center')}>
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
          {/* AM/PM toggle */}
          <div className="flex gap-1 text-base mt-1">
            <div
              className={cls('hover:bg-gray-100 cursor-pointer px-1 rounded', {
                'bg-primary text-white hover:bg-primary-hover':
                  meridiem === MeridiemEnum.AM,
              })}
              onClick={setAM}
            >
              {Language.$t.Meridiem.AM}
            </div>
            <div>・</div>
            <div
              className={cls('hover:bg-gray-100 cursor-pointer px-1 rounded', {
                'bg-primary text-white hover:bg-primary-hover':
                  meridiem === MeridiemEnum.PM,
              })}
              onClick={setPM}
            >
              {Language.$t.Meridiem.PM}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(observer(MiniClock));
