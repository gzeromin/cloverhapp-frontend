'use client';
import cls from 'classnames';
import { InputHTMLAttributes, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx/index';

interface MiniClockProps extends InputHTMLAttributes<HTMLInputElement> {
  className: string;
  stampedAt: Date;
  setStampedAt: (newDate: Date) => void;
}

enum MeridiemEnum {
  AM = 0,
  PM = 1,
}

const MiniClock: React.FC<MiniClockProps> = ({
  className,
  stampedAt,
  setStampedAt,
}) => {
  const stampedHour = stampedAt.getHours();
  const [meridiem, setMeridiem] = useState(MeridiemEnum.AM);
  const [hour, setHour] = useState(stampedHour);

  useEffect(() => {
    if (stampedHour > 12) {
      setMeridiem(MeridiemEnum.PM);
      setHour(stampedHour - 12);
    } else if (stampedHour == 12) {
      setMeridiem(MeridiemEnum.PM);
    }
  }, []);

  const center = { x: 67, y: 67 }; // 시계 중심 위치
  const radius = 67; // 시계 숫자의 원형 배치 반지름
  const angleStep = (2 * Math.PI) / 12; // 시계 각도 단위

  // 각 숫자의 위치 계산 함수
  const getPosition = (angle: number) => ({
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
  });

  const setAM = () => {
    const newStampedAt = new Date(stampedAt);
    if (stampedHour > 12) {
      newStampedAt.setHours(stampedHour - 12);
    } else if (stampedHour == 12) {
      newStampedAt.setHours(0);
    }
    setStampedAt(newStampedAt);
    setMeridiem(MeridiemEnum.AM);
  };

  const setPM = () => {
    const newStampedAt = new Date(stampedAt);
    if (stampedHour < 12) {
      newStampedAt.setHours(stampedHour + 12);
    } else if (stampedHour == 12) {
      newStampedAt.setHours(stampedHour);
    }
    setStampedAt(newStampedAt);
    setMeridiem(MeridiemEnum.PM);
  };

  const changeHour = (hour: number) => {
    const newStampedAt = new Date(stampedAt);
    newStampedAt.setHours(hour);
    if (meridiem == MeridiemEnum.AM) {
      if (hour == 12) {
        newStampedAt.setHours(0);
      }
    } else {
      if (hour < 12) {
        newStampedAt.setHours(hour + 12);
      }
    }
    setStampedAt(newStampedAt);
    setHour(hour);
  };

  return (
    <div
      className={`absolute w-40 h-40 m-1 rounded-full bg-white shadow-md ${className}`}
    >
      <div className="absolute inset-0 flex justify-center items-center">
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i - 2) * angleStep;
          const position = getPosition(angle);
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
                    'bg-primary text-white hover:bg-primary-hover':
                      hour === i + 1,
                  },
                )}
                onClick={() => changeHour(i + 1)}
              >
                <span className={cls('text-lg font-bold')}>{i + 1}</span>
              </div>
            </div>
          );
        })}
        <div className="flex gap-1 text-base">
          <div
            className={cls('hover:bg-gray-100 cursor-pointer px-1 rounded', {
              'bg-primary text-white hover:bg-primary-hover':
                meridiem == MeridiemEnum.AM,
            })}
            onClick={setAM}
          >
            {Language.$t.Meridiem.AM}
          </div>
          <div>・</div>
          <div
            className={cls('hover:bg-gray-100 cursor-pointer px-1 rounded', {
              'bg-primary text-white hover:bg-primary-hover':
                meridiem == MeridiemEnum.PM,
            })}
            onClick={setPM}
          >
            {Language.$t.Meridiem.PM}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(MiniClock);
