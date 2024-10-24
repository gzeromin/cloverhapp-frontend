'use client';
import cls from 'classnames';
import { Dispatch, SetStateAction, useState, useEffect, memo } from 'react';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import InputTimeModule from '../molecules/InputTimeModule';
import SliderHapp from '../atoms/SliderHapp';
import DateUtils from '@/utils/date.util';
import Constants from '@/common/constants';
import InputDateModule from '../molecules/InputDateModule';

interface StartEndTimeInputProps {
  className?: string;
  startTime: Date;
  endTime?: Date;
  setStartTime: Dispatch<SetStateAction<Date>>;
  setEndTime?: Dispatch<SetStateAction<Date | undefined>>;
}

const StartEndTimeInput: React.FC<StartEndTimeInputProps> = ({
  className,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
}) => {
  const [duration, setDuration] = useState(0);

  // Helper function to add minutes to a Date object
  const addMinutes = (date: Date, minutes: number) => {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
  };

  // 슬라이더로 지속 시간 변경
  const handleDurationChange = (min: number) => {
    if (setDuration) {
      setDuration(min);
    }

    // Update end time based on the new duration
    if (startTime && setEndTime) {
      const newEndTime = addMinutes(startTime, min);
      setEndTime(newEndTime);
    }
  };

  // 시작 시간 변경 핸들러
  const handleStartTimeChange = (newTime: Date) => {
    if (setStartTime) {
      setStartTime(newTime);
    }

    // 시작 시간이 종료 시간보다 클 경우, 종료 시간을 시작 시간으로 업데이트
    if (endTime && newTime > endTime && setEndTime) {
      setEndTime(newTime);
    }

    // Recalculate duration based on the new start time and existing end time
    if (newTime && endTime && setDuration) {
      const newDuration = DateUtils.calculateDuration(newTime, endTime);
      setDuration(newDuration);
    }
  };

  // 종료 시간 변경 핸들러
  const handleEndTimeChange = (newTime: Date) => {
    if (setEndTime) {
      setEndTime(newTime);
    }
    // 종료 시간이 시작 시간보다 작을 경우, 시작 시간을 종료 시간으로 업데이트
    if (startTime && newTime < startTime && setStartTime) {
      setStartTime(newTime);
    }
    // Recalculate duration based on the new end time and existing start time
    if (startTime && newTime && setDuration) {
      const newDuration = DateUtils.calculateDuration(startTime, newTime);
      setDuration(newDuration);
    }
  };

  // 종료 시간을 15분 뒤로 설정
  const handleEndTimePlus15min = () => {
    if (endTime) {
      const newTime = addMinutes(endTime, 15);
      handleEndTimeChange(newTime);
    }
  };

  // 슬라이더로 시작 시간을 기준으로 시간을 변경
  const handleTimeChange = (offset: number) => {
    const newTime = addMinutes(startTime, offset);
    handleStartTimeChange(newTime);
  };

  useEffect(() => {
    // 최초 렌더링 시, 지속 시간을 계산해서 설정
    if (!duration && startTime && endTime && setDuration) {
      const initialDuration = DateUtils.calculateDuration(startTime, endTime);
      setDuration(initialDuration);
    }
  }, [startTime, setStartTime, endTime, setEndTime, setDuration]);

  return (
    <div className={cls('text-gray-600', Language.logoFont, className)}>
      <div className={cls('flex flex-col')}>
        <div className={cls('flex items-center justify-between gap-1')}>
          <div className={cls('flex items-center gap-4 justify-around grow')}>
            {/* 날짜 입력 */}
            <InputDateModule
              startTime={startTime}
              setStartTime={handleStartTimeChange}
            />
            {/* 시작 시간 입력 */}
            <InputTimeModule
              time={startTime}
              setTime={handleStartTimeChange}
              className={cls('')}
            />
          </div>
          <div className='flex items-center gap-4'>
            <p className='cursor-default'>
              {Constants.SYMBOLS.TILDE}
            </p>
            {/* 날짜 입력 */}
            <InputDateModule
              startTime={endTime}
              setStartTime={handleEndTimeChange}
            />
            {/* 종료 시간 입력 */}
            <InputTimeModule
              time={endTime}
              setTime={handleEndTimeChange}
            />
          </div>
        </div>

        {/* 슬라이더로 현재 시간 변경 */}
        <SliderHapp
          showHour={false}
          setCurrentAmount={handleTimeChange}
        />

        {/* 슬라이더로 지속 시간 입력 */}
        <div className={cls('flex flex-col')}>
          <div className={cls(
            'flex items-center justify-between',
            'text-sm mt-2'
          )}>
            <div className={cls('text-primary cursor-default')}>
              {Language.$t.Time.Duration}
            </div>
            <div className={cls('flex gap-1')}>
              {/* 종료 시간을 시작 시간으로 설정하는 버튼 */}
              <button
                onClick={() => handleDurationChange(0)}
                className={cls(
                  'border border-primary text-primary',
                  'rounded-lg px-1',
                  'hover:bg-primary hover:text-white'
                )}
              >
                {Language.$t.Time.Minute0}
              </button>
              {/* 종료 시간을 15분 뒤로 설정하는 버튼 */}
              <button
                onClick={() => handleEndTimePlus15min()}
                className={cls(
                  'border border-primary text-primary',
                  'rounded-lg px-1',
                  'hover:bg-primary hover:text-white'
                )}
              >
                {Language.$t.Time.Plus15Minute}
              </button>
              {/* 종료 시간을 현재 시각으로 설정하는 버튼 */}
              <button
                onClick={() => handleEndTimeChange(new Date())}
                className={cls(
                  'border border-primary text-primary',
                  'rounded-lg px-1',
                  'hover:bg-primary hover:text-white'
                )}
              >
                {Language.$t.Time.Now}
              </button>
            </div>
          </div>
          <SliderHapp
            showHour={true}
            currentAmount={duration}
            setCurrentAmount={handleDurationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(observer(StartEndTimeInput));
