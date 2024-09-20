import { Language, TimeCtrllor } from '@/mobx';
import dateUtil from '@/utils/date.util';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import { useAuthState } from '@/context/auth';
import { Happ } from '@/types/Happ';
import cls from 'classnames';
import CellW from '@/components/molecules/week/CellW';
import CalendarHapp from '@/components/molecules/CalendarHapp';

const Week: React.FC = () => {
  const { happList } = useAuthState();

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

        // filter happ
        const happs = happList.filter((v: Happ) =>
          dateUtil.getFiveToFourHour(date, new Date(v.happedAt)),
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
            {happs.map(happ => 
              <CalendarHapp key={`calendar weekly happ ${happ.id}`} happ={happ} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(observer(Week));
