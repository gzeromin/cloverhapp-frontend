import { Loading, TimeCtrllor } from '@/mobx';
import dateUtil from '@/utils/date.util';
import { observer } from 'mobx-react-lite';
import { memo, useRef } from 'react';
import cls from 'classnames';
import { useDrop } from 'react-dnd';
import { getCreatedDate, getModifiedDate } from '@/utils/drop.util';
import api from '@/utils/api.util';
import { handleError } from '@/utils/error.util';
import { AuthActionEnum, useAuthDispatch } from '@/context/auth';
import { Dnd } from '@/types/Happ';
import { UserStamp } from '@/types/UserStamp';

interface Props {
  weekStr: string;
  date: Date;
}

const CellW: React.FC<Props> = ({ weekStr, date }) => {
  const dateValue = date.getDate();
  const dispatch = useAuthDispatch();
  
  const [, modifiedRef] = useDrop({
    accept: Dnd.MODIFIED,
    drop: async (item: { id: string; happedAt: Date }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const modifiedDate = getModifiedDate(clientOffset, item.happedAt);
      if (!modifiedDate) return;
      // update modifiedDate
      Loading.setIsLoading(true);
      try {
        const res = await api.patch('/happ/modifiedDate', { id: item.id, happedAt: modifiedDate});
        dispatch(AuthActionEnum.UPDATE_HAPP, res.data);
      } catch (error) {
        handleError(error);
      } finally {
        Loading.setIsLoading(false);
      }
    },
  });
  const [, createdRef] = useDrop({
    accept: Dnd.CREATED,
    drop: async ( UserStamp: UserStamp, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const createdDate = getCreatedDate(clientOffset);
      if (!createdDate) return;
      // Stamping by Drag and Drop
      Loading.setIsLoading(true);
      try {
        const res = await api.post('/happ/byDnd', { UserStamp, happedAt: createdDate});
        dispatch(AuthActionEnum.SET_HAPP, res.data);
      } catch (error) {
        handleError(error);
      } finally {
        Loading.setIsLoading(false);
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
        className={`
          text-center
          h-[23px]
          border-b-2
          ${dateUtil.isSaturday(date) && 'text-saturday'}
          ${dateUtil.isSunday(date) && 'text-red-500'}
          ${TimeCtrllor.isToday(date) && 'border-pink-400'}
        `}
        date-value={dateValue}
      >
        {dateValue}日({weekStr})
      </div>
      <div className="relative mt-3" ref={ref}>{renderSchedule()}</div>
    </div>
  );
};

export default memo(observer(CellW));
