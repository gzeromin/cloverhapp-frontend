'use client';
import cls from 'classnames';
import { Dispatch, SetStateAction, useEffect, memo } from 'react';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import InputTimeModule from '../molecules/InputTimeModule';
import SliderHapp from '../atoms/SliderHapp';

interface StartEndTimeInputProps {
  className?: string;
  startTime?: Date;
  setStartTime?: Dispatch<SetStateAction<Date | undefined>>;
}

const StartEndTimeInput: React.FC<StartEndTimeInputProps> = ({
  className,
  startTime,
  setStartTime,
}) => {
  // Helper function to add minutes to a Date object
  const addMinutes = (date: Date, minutes: number) => {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
  };

  // 시작 시간 변경 핸들러
  const handleStartTimeChange = (newTime: Date) => {
    if (setStartTime) {
      setStartTime(newTime);
    }
  };

  // 슬라이더로 현재 시간을 기준으로 시간을 변경
  const handleTimeChange = (offset: number) => {
    const newTime = addMinutes(new Date(), offset);
    handleStartTimeChange(newTime);
  };

  useEffect(() => {
    // 최초 랜더링 시, 시작 시간이 없으면 현재시간으로 설정
    if (!startTime && setStartTime) {
      setStartTime(new Date());
    }
  }, [startTime, setStartTime]);

  return (
    <div className={cls('text-gray-600', Language.logoFont, className)}>
      <div className={cls(
        'flex items-center justify-center gap-1',
        '-translate-x-[16px]'
      )}>
        {/* 시작 시간 입력 */}
        <InputTimeModule
          time={startTime}
          setTime={handleStartTimeChange}
          className={cls('')}
        />
      </div>
      {/* 슬라이더로 현재 시간 변경 */}
      <SliderHapp
        showHour={false}
        setCurrentAmount={handleTimeChange}
      />
    </div>
  );
};

export default memo(observer(StartEndTimeInput));
