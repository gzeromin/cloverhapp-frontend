'use client';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import { TimeCtrllor } from '@/mobx/index';
import dateUtil from '@/utils/date.util';

interface MiniCalendarProps {
  className: string;
  startTime: Date;
  setStartTime: (newDate: Date) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  className,
  startTime,
  setStartTime,
}) => {
  const month = startTime.getMonth();

  const changeStartTime = (newDate: Date | boolean) => {
    if (newDate instanceof Date) {
      const newStartTime = new Date(startTime);
      newStartTime.setDate(newDate.getDate());
      setStartTime(newStartTime);
    }
  };

  const renderDays = (week: number, showMonth: number) => {
    return [...Array(7)].map((v, i) => {
      const firstDate = new Date(TimeCtrllor.selectedYear, showMonth, 1);
      const lastDate = new Date(TimeCtrllor.selectedYear, showMonth + 1, 0);
      const dateNum = 7 * (week - 1) + (i + 1) - (firstDate.getDay() - 1);
      const date =
        firstDate.getDate() <= dateNum &&
        dateNum <= lastDate.getDate() &&
        new Date(firstDate.getFullYear(), firstDate.getMonth(), dateNum);

      return (
        <td
          key={`day-${dateNum}`}
          className={`
            ${date && dateUtil.isSaturday(date) && 'text-saturday'}
            ${date && dateUtil.isSunday(date) && 'text-red-500'}
          `}
          onClick={() => changeStartTime(date)}
        >
          {date && (
            <span
              className={cls('rounded cursor-pointer hover:bg-gray-100 p-1', {
                'bg-primary text-white hover:bg-primary-hover':
                  dateUtil.isTargetDate(date, startTime),
              })}
            >
              {date.getDate()}
            </span>
          )}
        </td>
      );
    });
  };

  const renderWeeks = () => {
    const weeksCount = TimeCtrllor.getWeeksCountByMonth2(month);
    return [...Array(weeksCount)].map((v, i) => {
      const week = i;
      return <tr key={`week-${week}`}>{renderDays(week, month)}</tr>;
    });
  };

  return (
    <div className={`m-1 flex items-center justify-end ${className}`}>
      <div
        className="m-1 text-center text-base"
        key={`mini calendar showMonth ${month}`}
      >
        <span className="text-gray-600">
          {month + 1 === 0 ? '12' : month + 1}
        </span>
        <table className="w-[120px] text-center text-sm">
          <thead>
            <tr>
              {dateUtil.weeksJp2.map((v, i) => (
                <th
                  key={`mini calendar ${i}`}
                  className={`text-gray-500 ${i === 5 && 'text-saturday'} ${
                    i === 6 && 'text-red-500'
                  }`}
                >
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderWeeks()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default observer(MiniCalendar);
