import { Dispatch, SetStateAction } from 'react';
import InputDateModule from '../molecules/InputDateModule';
import cls from 'classnames';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { Language } from '@/mobx';
import { observer } from 'mobx-react-lite';
interface DateTimesInputProps {
  className?: string; 
  times?: Date[];
  setTimes?: Dispatch<SetStateAction<Date[]>>;
}

const DateTimesInput: React.FC<DateTimesInputProps> = ({
  times,
  setTimes,
  className,
}) => {
  const addInputModule = () => {
    if (times && setTimes) {
      // 빈 데이트 객체를 추가해 새로운 입력 필드를 추가
      const len = times.length;
      setTimes([...times, len > 0 ? new Date(times[len-1]) : new Date()]);
    }
  };

  const deleteInputModule = (index: number) => {
    if (times && setTimes) {
      const newTimes = [...times];
      newTimes.splice(index, 1);
      setTimes(newTimes);
    }
  };

  const updateTime = (index: number, newTime: Date) => {
    if (times && setTimes) {
      const updatedTimes = [...times];
      updatedTimes[index] = newTime;
      setTimes(updatedTimes);
    }
  };

  return (
    <div className={cls(Language.logoFont, className)}>
      {times && times.map((time, index) => (
        <div 
          key={`copy happ ${index}`}
          className={cls('flex items-center justify-between')}
        >
          <span className={cls('text-base text-green-700 mr-2')}>
            { index + 1 }
          </span>
          <InputDateModule
            className={cls('grow')}
            startTime={time}
            setStartTime={(newTime) => updateTime(index, newTime)}
          />
          <MdOutlineDelete 
            className={cls(
              'text-gray-100 rounded-lg',
              'hover:text-primary-100 cursor-pointer'
            )}
            onClick={() => deleteInputModule(index)}
          />
        </div>
      ))}

      <MdOutlineAddBox
        onClick={addInputModule}
        className={cls(
          'mx-auto text-green-700',
          'hover:bg-gray-100 cursor-pointer'
        )}
      />
    </div>
  );
};

export default observer(DateTimesInput);
