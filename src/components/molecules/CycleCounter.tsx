import React, { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import cls from 'classnames';
import CheckHapp from '../atoms/CheckHapp';
import InputHapp from './InputHapp';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import SelectHapp, { OptionType } from '../atoms/SelectHapp';
import { CounterUnit, IntervalUnit } from '@/types/UserStamp';
import DateUtils from '@/utils/date.util';
import { StampType } from '@/types/Stamp';

interface Props {
  id?: string;
  type: StampType | undefined;
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
  id,
  type,
  existGoal,
  setExistGoal,
  goalUnit,
  setGoalUnit,
  goalInterval,
  setGoalInterval,
  goalNumber,
  setGoalNumber,
}) => {
  const [options, setOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    let selectedUnits: CounterUnit[] = [];
    switch (type) {
    case StampType.WAKE_UP:
    case StampType.GO_TO_BED:
      selectedUnits = [CounterUnit.Hour];
      setGoalUnit(CounterUnit.Hour);
      break;
    case StampType.BOOK:
      selectedUnits = [CounterUnit.Book, CounterUnit.Time];
      setGoalUnit(CounterUnit.Book);
      break;
    case StampType.EXERCISE:
    case StampType.MEDITATION:
    case StampType.STUDY:
      selectedUnits = [CounterUnit.Number, CounterUnit.Time];
      setGoalUnit(CounterUnit.Number);
      break;
    case StampType.EXPENSE:
    case StampType.INCOME:
      selectedUnits = [CounterUnit.Won, CounterUnit.Yen, CounterUnit.Dollar];
      setGoalUnit(CounterUnit.Won);
      break;
    case StampType.WATER:
      selectedUnits = [CounterUnit.Milliliter];
      setGoalUnit(CounterUnit.Milliliter);
      break;
    case StampType.HAPPY:
    case StampType.MEDICINE:
      selectedUnits = [CounterUnit.Number];
      setGoalUnit(CounterUnit.Number);
      break;
    case StampType.MEAL:
      selectedUnits = [CounterUnit.Number, CounterUnit.Dollar, CounterUnit.Won, CounterUnit.Yen];
      setGoalUnit(CounterUnit.Number);
      break;
    }
    const options = 
      Object.values(CounterUnit)
        .filter(e => selectedUnits.includes(e))
        .map(v => ({
          value: v, 
          labelLevel1: 'CounterUnit', 
          labelLevel2: v,
        }));
    setOptions(options);
    setGoalNumber('0');
  }, [type]);

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

  const getInputType = (goalUnit: CounterUnit) => {
    switch(goalUnit) {
    case CounterUnit.Time:
      return 'range';
    case CounterUnit.Hour:
      return 'time';
    default:
      return 'number';
    }
  };

  const getStep = (goalUnit: CounterUnit) => {
    switch(goalUnit) {
    case CounterUnit.Milliliter:
      return '500';
    case CounterUnit.Time:
      return '1'; // 1당 15분
    case CounterUnit.Hour:
      return '900';
    default:
      return '1';
    }
  };

  const getMin = (goalUnit: CounterUnit) => {
    switch(goalUnit) {
    case CounterUnit.Hour:
      return '00:00';
    default:
      return '0';
    }
  };

  const getMax = (goalUnit: CounterUnit) => {
    switch(goalUnit) {
    case CounterUnit.Time:
      return '48';
    default:
      return undefined;
    }
  };

  return (
    <div
      className={cls('flex items-center justify-between')}
      id={id}
    >
      <CheckHapp
        className={cls('mx-3')}
        checked={existGoal}
        onChange={(e) => setExistGoal(e.target.checked)}
        marginBottom='mb-0'
        id={`${id}-existGoalCheck`}
      />
      <div
        className={cls(
          'flex items-center', {
            'cursor-pointer': existGoal,
            'text-gray-400 cursor-not-allowed': !existGoal,
          },
        )}
        id={`${id}-goalInterval`}
      >
        <div
          className={tabStyleDefault}
          onClick={() => setGoalInterval(IntervalUnit.Month)}
          id={`${id}-goalInterval-month`}
        >
          <div className={tabStyleSelected(IntervalUnit.Month)}>{Language.$t.Date.Month}</div>
        </div>
        <div
          className={tabStyleDefault}
          onClick={() => setGoalInterval(IntervalUnit.Week)}
          id={`${id}-goalInterval-week`}
        >
          <div className={tabStyleSelected(IntervalUnit.Week)}>{Language.$t.Date.Week}</div>
        </div>
        <div
          className={tabStyleDefault}
          onClick={() => setGoalInterval(IntervalUnit.Day)}
          id={`${id}-goalInterval-day`}
        >
          <div className={tabStyleSelected(IntervalUnit.Day)}>{Language.$t.Date.Day}</div>
        </div>
      </div>
      <div className={cls('flex flex-col grow')}>
        {goalUnit === CounterUnit.Time && (
          <div 
            className='flex justify-between px-3'
          >
            <span className={cls('text-xs text-gray-400')}>
              0 {Language.$t.Time.Hour}
            </span>
            <span 
              className={cls('text-xs text-blue-700')}
              id={`${id}-goalNumberTime`}
            >
              {DateUtils.getFormatHourMinBy15Minutes(Number(goalNumber))}
            </span>
            <span className={cls('text-xs text-gray-400')}>
              12 {Language.$t.Time.Hours}
            </span>
          </div>
        )}
        <InputHapp
          className={cls(
            'flex gap-3 items-center justify-end',
            'ml-5 mr-2 text-base self-stretch'
          )}
          type={getInputType(goalUnit)}
          placeholder={'0'}
          value={goalNumber}
          onChange={(e)=> setGoalNumber(e.target.value)}
          inputClassName='text-center'
          min={getMin(goalUnit)}
          max={getMax(goalUnit)}
          disable={!existGoal}
          step={getStep(goalUnit)}
          border={CounterUnit.Time !== goalUnit}
          id={`${id}-goalNumberInput`}
        />
      </div>
      <SelectHapp
        className={cls(
          'rounded-md text-gray-500 text-base w-1/5',
        )}
        options={options}
        selected={goalUnit}
        onSelected={setGoalUnit}
        border={true}
        dark={true}
        wide={true}
        disable={!existGoal}
        id={`${id}-goalUnitSelect`}
      />
    </div>
  );
};

export default memo(observer(CycleCounter));
