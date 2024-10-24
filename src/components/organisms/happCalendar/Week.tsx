import { Language, TimeCtrllor } from '@/mobx';
import DateUtils from '@/utils/date.util';
import { observer } from 'mobx-react-lite';
import { memo, useRef } from 'react';
import { Happ } from '@/types/Happ';
import cls from 'classnames';
import CellW from '@/components/molecules/week/CellW';
import CalendarHappIcon from '@/components/molecules/week/CalendarHappIcon';
import { useHappState } from '@/context/happ';

const Week: React.FC = () => {
  const { happList } = useHappState();
  const weekRefs = useRef<(HTMLDivElement | null)[]>([]); 
  
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
          DateUtils.getFiveToFourHour(date, new Date(v.startTime)),
        );

        return (
          <div
            key={`calendarW week-${i}`}
            className={cls('relative')}
            ref={(el) => {weekRefs.current[i] = el;}}
          >
            <CellW
              weekStr={w}
              date={date}
              weekRef={{ current: weekRefs.current[i]}}
            />
            {happs.map((happ, index) => 
              <CalendarHappIcon key={`calendar weekly happ ${happ.id} ${index}`} happ={happ} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(observer(Week));
