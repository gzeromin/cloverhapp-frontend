import React, { Dispatch, memo, SetStateAction } from 'react';
import cls from 'classnames';
import CheckHapp from '../atoms/CheckHapp';
import InputHapp from '../atoms/InputHapp';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import SelectHapp from '../atoms/SelectHapp';
import { CounterUnit, IntervalUnit } from '@/types/UserStamp';
import dateUtils from '@/utils/date.util';

const options = Object.values(CounterUnit)
  .map(v => ({
    value: v, 
    labelLevel1: 'CounterUnit', 
    labelLevel2: v,
  }));
interface Props {
  testId?: string;
  existGoal: boolean;
  setExistGoal: Dispatch<SetStateAction<boolean>>;
  goalUnit: CounterUnit;
  setGoalUnit: Dispatch<SetStateAction<CounterUnit>>;
  goalInterval: IntervalUnit;
  setGoalInterval: Dispatch<SetStateAction<IntervalUnit>>;
  goalNumber: string;
  setGoalNumber: Dispatch<SetStateAction<string>>;
}

const CycleCounter: React.FC<Props> = ({
  testId,
  existGoal,
  setExistGoal,
  goalUnit,
  setGoalUnit,
  goalInterval,
  setGoalInterval,
  goalNumber,
  setGoalNumber,
}) => {
  const tabStyleDefault = 'rounded-full p-2 mx-1 w-10 h-10 text-center';

  const tabStyleSelected = (unit: IntervalUnit) => {
    if (existGoal) {
      if (goalInterval == unit) {
        // selected
        return 'rounded-full shadow-lg text-green-700 bg-green-100 ';
      } else {
        // non selected
        return 'hover:bg-gray-100 bg-gray-50 shadow-lg rounded-full text-gray-600 hover:text-gray-700';
      }
    }
    return 'bg-gray-50 shadow-lg rounded-full';
  };

  const getInputType = () => {
    switch(goalUnit) {
    case CounterUnit.Time:
      return 'range';
    case CounterUnit.Hour:
      return 'time';
    default:
      return 'number';
    }
  };

  const getStep = () => {
    switch(goalUnit) {
    case CounterUnit.Milliliter:
      return '500';
    case CounterUnit.Time:
      return '15';
    case CounterUnit.Hour:
      return '900';
    default:
      return '1';
    }
  };

  const getMin = () => {
    switch(goalUnit) {
    case CounterUnit.Hour:
      return '00:00';
    default:
      return '0';
    }
  };

  const getMax = () => {
    switch(goalUnit) {
    case CounterUnit.Time:
      return '750';
    default:
      return undefined;
    }
  };

  return (
    <div
      className={cls('flex items-center justify-between')}
      test-id={testId}
    >
      <CheckHapp
        className={cls('mx-3')}
        checked={existGoal}
        onChange={(e) => setExistGoal(e.target.checked)}
        marginBottom='mb-0'
      />
      <div className={cls(
        'flex items-center', {
          'cursor-pointer': existGoal,
          'text-gray-400 cursor-not-allowed': !existGoal,
        },
      )}>
        <div
          className={tabStyleDefault}
          onClick={() => setGoalInterval(IntervalUnit.Month)}
        >
          <div className={tabStyleSelected(IntervalUnit.Month)}>{Language.$t.Date.Month}</div>
        </div>
        <div
          className={tabStyleDefault}
          onClick={() => setGoalInterval(IntervalUnit.Week)}
        >
          <div className={tabStyleSelected(IntervalUnit.Week)}>{Language.$t.Date.Week}</div>
        </div>
        <div
          className={tabStyleDefault}
          onClick={() => setGoalInterval(IntervalUnit.Day)}
        >
          <div className={tabStyleSelected(IntervalUnit.Day)}>{Language.$t.Date.Day}</div>
        </div>
      </div>
      <div className={cls('flex flex-col grow')}>
        {goalUnit === CounterUnit.Time && (
          <div className='flex justify-between px-3'>
            <span className={cls('text-xs text-gray-400')}>
              0 {Language.$t.Time.Hour}
            </span>
            <span className={cls('text-xs text-blue-700')}>
              {dateUtils.getFormatHourMinByMinutes(Number(goalNumber))}
            </span>
            <span className={cls('text-xs text-gray-400')}>
              15 {Language.$t.Time.Hours}
            </span>
          </div>
        )}
        <InputHapp
          className={cls(
            'flex gap-3 items-center justify-end',
            'ml-5 mr-2 text-base self-stretch'
          )}
          type={getInputType()}
          placeholder={'0'}
          value={goalNumber}
          onChange={(e)=> setGoalNumber(e.target.value)}
          inputClassName='text-center'
          min={getMin()}
          max={getMax()}
          marginBottom='mb-0'
          disable={!existGoal}
          step={getStep()}
          border={CounterUnit.Time !== goalUnit}
        />
      </div>
      <SelectHapp
        className={cls(
          'rounded-md text-gray-500 text-base w-1/5',
        )}
        options={options}
        selected={goalUnit}
        onSelected={setGoalUnit}
        testId="typeSelect"
        border={true}
        dark={true}
        wide={true}
        disable={!existGoal}
      />
    </div>
  );
};

export default memo(observer(CycleCounter));
