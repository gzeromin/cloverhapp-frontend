'use client';
import cls from 'classnames';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { LuGlassWater } from 'react-icons/lu';
import { Language } from '@/mobx';

interface WaterHappProps {
  className?: string;
  inputClassName?: string;
  disable?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  testId?: string;
}

const WaterHapp: React.FC<WaterHappProps> = ({
  className,
  inputClassName,
  disable = false,
  value = '0',
  onChange,
  testId,
}) => {
  const [inputValue, setInputValue] = useState<number>(parseInt(value));

  // 슬라이더 값 변경 핸들러
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setInputValue(newValue); // 실시간으로 슬라이더 값 업데이트
    if (onChange) {
      onChange(e); // 부모 컴포넌트로 값 전달
    }
  };

  return (
    <div className={cls(className)}>
      <div className={cls('flex items-center justify-between gap-1')}>
        <LuGlassWater className={cls('text-cyan-400 text-3xl')}/>
        <input
          type="range"
          min="0"
          max="550"
          step="10"
          value={inputValue}
          disabled={disable}
          onChange={handleSliderChange}
          className={cls(
            'grow focus:outline-none',
            { 'cursor-not-allowed': disable },
            inputClassName,
          )}
          data-cy={testId}
        />
        <div className={cls('text-end text-base w-1/4', Language.logoFont)}>
          {inputValue/10}{Language.$t.Input.Sip}, {inputValue} ml {/* 선택된 물의 양을 표시 */}
        </div>
      </div>
    </div>
  );
};

export default observer(WaterHapp);
