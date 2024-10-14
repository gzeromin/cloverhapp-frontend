import { useState, useRef, useEffect } from 'react';
import cls from 'classnames';
import { Language } from '@/mobx';

interface Props {
  showHour?: boolean;
  currentAmount?: number; // 분 단위
  setCurrentAmount: (e: number) => void;
}

const SliderHapp: React.FC<Props> = ({
  showHour = false,
  currentAmount,
  setCurrentAmount,
}) => {
  const [currentHour, setCurrentHour] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(0);
  const range = 4; // -3 to +3
  const initialValues = Array.from({ length: range * 2 + 1 }, (_, i) => i - range);
  
  const [hourNumbers, setHourNumbers] = useState(initialValues); // 시간 값 배열
  const [minuteNumbers, setMinuteNumbers] = useState(initialValues); // 분 값 배열

  const dragStartX = useRef<number | null>(null); // 시작할 때 마우스 X 좌표 저장
  const [dragging, setDragging] = useState(false); // 드래그 여부 상태 관리

  // TODO 1: Set currentHour and currentMinute based on currentAmount
  useEffect(() => {
    if (currentAmount) {
      const hours = Math.floor(currentAmount / 60);
      const minutes = currentAmount % 60;
      setCurrentHour(hours);
      setCurrentMinute(minutes);
      // Adjust the displayed numbers to center the hour and minute
      setHourNumbers(initialValues.map(n => n + hours));
      setMinuteNumbers(initialValues.map(n => n + minutes));
    } else {
      setCurrentHour(0);
      setCurrentMinute(0);
    }
  }, [currentAmount]);

  useEffect(() => {
    // TODO currentHour, currentMinute 값이 변할 때마다 currentAmount 재설정
    const totalMinutes = currentHour * 60 + currentMinute;
    setCurrentAmount(totalMinutes);
  }, [currentHour, currentMinute]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    setDragging(true);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>, 
    isHour: boolean
  ) => {
    if (!dragging || dragStartX.current === null) return;

    const diffX = e.clientX - dragStartX.current; 
    const threshold = 30; // 이동 임계값 (픽셀 기준)

    if (Math.abs(diffX) >= threshold) {
      const direction = diffX > 0 ? -1 : 1;

      if (isHour) {
        // currentHour가 0 이상일 때만 음수 방향 드래그 허용
        if (direction === -1 && currentHour === 0) return; // 음수로 못가게 막기

        const newHourNumbers = hourNumbers.map(num => num + direction);
        setHourNumbers(newHourNumbers);
        setCurrentHour(currentHour + direction);
      } else {
        // currentMinute가 0 이상일 때만 음수 방향 드래그 허용
        if (showHour && direction === -1 && currentMinute === 0) return; // 음수로 못가게 막기

        const newMinuteNumbers = minuteNumbers.map(num => num + direction);
        setMinuteNumbers(newMinuteNumbers);
        setCurrentMinute(currentMinute + direction);
      }

      dragStartX.current = e.clientX;
    }
  };

  const clickValue = (
    num: number, 
    isHour: boolean
  ) => {
    if (showHour && num < 0) return;
    if (isHour) {
      setCurrentHour(num);
      const newHourNumbers = hourNumbers.map(n => n + (num - currentHour));
      setHourNumbers(newHourNumbers);
    } else {
      setCurrentMinute(num);
      const newMinuteNumbers = minuteNumbers.map(n => n + (num - currentMinute));
      setMinuteNumbers(newMinuteNumbers);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    dragStartX.current = null;
  };

  return (
    <div className="text-center select-none">
      {/* showHour가 true일 때만 시간 슬라이드 활성화 */}
      {showHour && (
        <div
          className="relative w-full"
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => handleMouseMove(e, true)} // 시간 슬라이드 처리
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className={cls('flex items-center justify-center')}>
            <span className="text-base">{currentHour} {Language.$t.Time.Hour} {currentMinute} {Language.$t.Time.Minute}</span>
          </div>
          <div className={cls(
            'flex gap-3 items-center p-1',
            'text-sm transition-transform duration-300',
            'bg-green-50 rounded-md'
          )}>
            {hourNumbers.map((num, index) => (
              <span 
                key={index} 
                className={cls(
                  'flex-1',
                  currentHour === num && 'text-green-600 font-bold',
                  {'text-transparent cursor-default': num < 0},
                  {'cursor-pointer': num >= 0}
                )}
                onClick={() => clickValue(num, true)}
              >
                {num}
              </span>
            ))}
            <span className="flex-1 bg-green-100 rounded-full">{Language.$t.Time.Hour}</span>
          </div>
        </div>
      )}

      {/* 슬라이더 시각적 요소 */}
      <div className="flex flex-col">
        {/* 수직선 */}
        <div className="w-full h-1 bg-primary-100" />
      </div>

      {/* 분 슬라이드 */}
      <div 
        className="relative w-full"
        onMouseDown={handleMouseDown} 
        onMouseMove={(e) => handleMouseMove(e, false)} // 분 슬라이드 처리
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className={cls(
          'flex gap-3 items-center',
          'text-sm transition-transform duration-300',
          'bg-blue-50 rounded-md'
        )}>
          {minuteNumbers.map((num, index) => (
            <div 
              key={index} 
              className={cls(
                'flex-1 relative p-1',
                currentMinute === num && 'text-blue-600 font-bold',
                {'text-transparent': showHour && num < 0},
                {'cursor-pointer': showHour && num >= 0},
                {'cursor-pointer': !showHour},
              )}
              onClick={() => clickValue(num, false)}
            >
              {/* 눈금 */}
              {currentMinute === num && (
                <div 
                  className={cls(
                    'absolute left-1/2 -translate-y-3',
                    'w-1 h-3 rounded-full bg-primary-100'
                  )}
                />
              )}
              {num}
            </div>
          ))}
          <span className="flex-1 bg-blue-100 rounded-full">{Language.$t.Time.Minute}</span>
        </div>
      </div>
    </div>
  );
};

export default SliderHapp;
