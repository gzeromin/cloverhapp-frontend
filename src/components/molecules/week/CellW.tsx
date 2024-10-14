import { Language, TimeCtrllor } from '@/mobx';
import DateUtils from '@/utils/date.util';
import { observer } from 'mobx-react-lite';
import { memo, useRef } from 'react';
import cls from 'classnames';
import { useDrop } from 'react-dnd';
import { getCreatedDate, getModifiedDate, getModifiedXY } from '@/utils/drop.util';
import api from '@/utils/api.util';
import { handleError } from '@/utils/error.util';
import { UserStamp } from '@/types/UserStamp';
import { Dnd } from '@/enums/Dnd';
import { HappActionEnum, useHappDispatch } from '@/context/happ';

interface Props {
  weekStr: string;
  date: Date;
  weekRef: { current: HTMLDivElement | null};
}

const CellW: React.FC<Props> = ({ weekStr, date, weekRef }) => {
  const dateValue = date.getDate();
  const dispatch = useHappDispatch();
  
  const [, modifiedRef] = useDrop({
    accept: Dnd.MODIFIED_HAPP,
    drop: async (item: { id: string; startTime: Date }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const modifiedDate = getModifiedDate(clientOffset, item.startTime);
      const position = getModifiedXY(clientOffset, weekRef);
      if (!modifiedDate || !position) return;
      try {
        const res = await api.patch(
          '/happ/byDnd', { 
            id: item.id, 
            startTime: modifiedDate,
            positionX: position.x,
            positionY: position.y,
          }
        );
        dispatch(HappActionEnum.UPDATE_HAPP, res.data);
      } catch (error) {
        handleError(error);
      }
    },
  });
  const [, createdRef] = useDrop({
    accept: Dnd.CREATED_HAPP,
    drop: async ( UserStamp: UserStamp, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const createdDate = getCreatedDate(clientOffset);
      const position = getModifiedXY(clientOffset, weekRef);
      if (!createdDate || !position) return;
      // Stamping by Drag and Drop
      try {
        const res = await api.post('/happ/byDnd', { 
          UserStamp, 
          startTime: createdDate,
          positionX: position.x,
          positionY: position.y,
        });
        dispatch(HappActionEnum.SET_HAPP, res.data);
      } catch (error) {
        handleError(error);
      }
    },
  });
  
  // use a regular ref to hold the reference to the DOM element
  const ref = useRef<HTMLDivElement>(null);
  createdRef(modifiedRef(ref));

  const renderSchedule = () => {
    return [...Array(24)].map((v, i) => {
      const hour = (i + 5) % 24;
      return (
        <div key={`hour-${hour} ${date}`}>
          <div className="flex h-[21px] align-middle gap-0">
            <div 
              className="w-[14px] text-center text-gray-400 text-xs mr-1"
              hour-value={hour}
            >
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
        className={cls(
          'text-center h-[23px] border-b-2',
          {'text-saturday' : DateUtils.isSaturday(date)},
          {'text-red-500' : DateUtils.isSunday(date)},
          {'border-gray-400' : TimeCtrllor.isSelectedDate(date) && !TimeCtrllor.isToday(date)},
          {'border-pink-400': TimeCtrllor.isToday(date)},
        )}
        date-value={dateValue}
      >
        {dateValue}{Language.$t.Day}({weekStr})
      </div>
      <div className="relative mt-3" ref={ref}>{renderSchedule()}</div>
    </div>
  );
};

export default memo(observer(CellW));
