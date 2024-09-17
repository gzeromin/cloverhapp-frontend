import { Language, TimeCtrllor } from '@/mobx';
import dateUtil from '@/utils/date.util';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import CellW from '../molecules/CellW';
import { useAuthState } from '@/context/auth';
import { Stamp } from '@/types/Stamp';
import cls from 'classnames';
import CalendarStamp from '../molecules/CalendarStamp';

const Week: React.FC = () => {
  const { stampList } = useAuthState();
  
  const selectedDate = TimeCtrllor.selectedDate;
  const firstDate =
    selectedDate.getDate() -
    (selectedDate.getDay() - 1 < 0 ? 6 : selectedDate.getDay() - 1);

  return (
    <div className="grid grid-cols-7 gap-x-1">
      {Language.$t.Weeks.map((w: string, i: number) => {
        const dateNum = firstDate + i;
        const date = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          dateNum,
        );

        // filter stamp
        const stamps = stampList.filter((v: Stamp) =>
          dateUtil.getFiveToFourHour(date, new Date(v.stampedAt)),
        );

        return (
          <div 
            key={`calendarW week-${i}`}
            className={cls('relative')}
          >
            <CellW
              weekStr={w}
              date={date}
            />
            {stamps.map(stamp => 
              <CalendarStamp key={`calendar weekly stamp ${stamp.id}`} stamp={stamp} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(observer(Week));
