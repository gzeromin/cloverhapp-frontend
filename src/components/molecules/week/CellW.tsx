import { TimeCtrllor } from '@/mobx';
import dateUtil from '@/utils/date.util';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import cls from 'classnames';

interface Props {
  weekStr: string;
  date: Date;
}

const CellW: React.FC<Props> = ({ weekStr, date }) => {
  const renderSchedule = () => {
    return [...Array(24)].map((v, i) => {
      const hour = (i + 5) % 24;
      return (
        <div key={`hour-${hour} ${date}`}>
          <div className="flex h-[21px] align-middle gap-0">
            <div className="w-[14px] text-center text-gray-400 text-xs mr-1">
              {hour}
            </div>
            <div
              className={cls(
                'flex-auto h-[25px] mx-0 my-[5px]',
                'border-0 border-t-[1px] border-gray',
                'translate-y-[2px]',
                hour === 10 || hour === 19 || hour === 23 || hour === 7
                  ? 'border-solid'
                  : 'border-dotted')}
            ></div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="">
      <div
        className={`
          text-center
          h-[23px]
          border-b-2
          ${dateUtil.isSaturday(date) && 'text-saturday'}
          ${dateUtil.isSunday(date) && 'text-red-500'}
          ${TimeCtrllor.isToday(date) && 'border-pink-400'}
        `}
      >
        {date.getDate()}日({weekStr})
      </div>
      <div className="relative mt-3">{renderSchedule()}</div>
    </div>
  );
};

export default memo(observer(CellW));
