'use client';
import cls from 'classnames';
import { Dispatch, SetStateAction, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { MoneyUnit } from '@/types/Happ';
import { FaDollarSign, FaWonSign, FaYenSign } from 'react-icons/fa6';
import SelectHapp from './SelectHapp';

const options = [
  { value: MoneyUnit.Won, icon: <FaWonSign className='text-2xl text-primary'/> },
  { value: MoneyUnit.Yen, icon: <FaYenSign className='text-2xl text-green-700' /> },
  { value: MoneyUnit.Dollar, icon: <FaDollarSign className='text-2xl text-blue-700' /> },
];

interface MoneyHappProps {
  labelName?: string;
  placeholder?: string;
  error?: string;
  border?: boolean;
  marginBottom?: string;
  className?: string;
  inputClassName?: string;
  disable?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  testId?: string;
  min?: string;
  max?: string;
  moneyUnit: MoneyUnit;
  setMoneyUnit: Dispatch<SetStateAction<MoneyUnit>>;
}

const MoneyHapp: React.FC<MoneyHappProps> = ({
  labelName = '',
  placeholder = '',
  error,
  border = true,
  marginBottom = 'mb-3',
  className,
  inputClassName,
  disable = false,
  value = '',
  onChange,
  testId,
  min,
  max,
  moneyUnit,
  setMoneyUnit,
}) => {

  const [inputValue, setInputValue] = useState(value || '');

  // 1000 단위 콤마 찍기
  const formatWithComma = (val: string) => {
    if (!val) return '';
    // 입력값에서 숫자만 추출
    const onlyNums = val.replace(/[^\d]/g, '');
    return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 입력 값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatWithComma(e.target.value);
    setInputValue(formattedValue); // 콤마가 찍힌 값 설정
    if (onChange) {
      // 콤마 없이 숫자로만 onChange 이벤트 호출
      const rawValue = e.target.value.replace(/[^\d]/g, '');
      onChange({ ...e, target: { ...e.target, value: rawValue } });
    }
  };

  return (
    <div
      className={`${error ? 'mb-1' : marginBottom} ${className}`}
    >
      {labelName && (
        <label className="text-nowrap font-extralight text-sm mr-2 mb-1">
          {labelName}
        </label>
      )}
      <div className={cls('flex items-center')}>
        <SelectHapp
          options={options}
          selected={moneyUnit}
          onSelected={setMoneyUnit}
        />
        <div className={cls('grow')}>
          <input
            type="text"
            min={min}
            max={max}
            style={{ minWidth: 200 }}
            className={cls(
              'w-full p-2 focus:bg-white focus:outline-none rounded text-right',
              { 'border-red-500': error },
              {
                'transition duration-200 border border-gray-400 bg-gray-50 hover:bg-white focus:border-happ-focus focus:ring-happ-focus focus:ring-4':
                  border,
              },
              inputClassName,
            )}
            placeholder={placeholder ? placeholder : labelName}
            value={inputValue}
            disabled={disable}
            onChange={handleChange}
            test-id={testId}
          />
          {error && (
            <div className="mt-2 font-light text-red-500 text-xs">⚠ {error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(MoneyHapp);
