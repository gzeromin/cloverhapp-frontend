import { TimeCtrllor } from '@/mobx';
import dateUtil from '@/utils/date.util';
import { observer } from 'mobx-react-lite';
import { memo, useRef } from 'react';
import cls from 'classnames';
import { useDrop } from 'react-dnd';

interface Props {
  weekStr: string;
  date: Date;
}

const CellW: React.FC<Props> = ({ weekStr, date }) => {
  const dateValue = date.getDate();
  
  const [, dropRef] = useDrop({
    accept: 'HAPP',
    drop: (item: { id: string; happedAt: Date }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        const dropElement = document.elementFromPoint(clientOffset.x, clientOffset.y);
        console.log('Dropped on element:', dropElement);
        const parent = dropElement?.parentElement;
        const grandparent = parent?.parentElement?.parentElement?.parentElement;

        console.log('Parent element:', parent);
        console.log('Grandparent element:', grandparent);

        // date-value 속성 읽기(날짜)
        const dateElement = grandparent?.querySelector('[date-value]');
        if (dateElement) {
          const dateValue = dateElement.getAttribute('date-value');
          console.log('Date value:', dateValue);
        }

        // hour-value 속성 읽기(시간)
        const hourElement = parent?.querySelector('[hour-value]');
        if (hourElement) {
          const hourValue = hourElement.getAttribute('hour-value');
          console.log('Hour value:', hourValue);
        }

        // 분 계산 하기
        if (dropElement) {
          // 드롭된 요소의 위치 및 크기 정보 가져오기
          const boundingRect = dropElement.getBoundingClientRect();
          // 요소의 왼쪽 경계선과 드롭된 지점의 x 좌표의 차이 구하기
          const offsetX = clientOffset.x - boundingRect.left;
          // 드롭된 요소의 너비
          const elementWidth = boundingRect.width;
          // 퍼센트 계산
          const minuteValue = Math.round((offsetX / elementWidth) * 60);
          console.log('Minute value:', minuteValue);
        }
      }
    },
  });
  
  // use a regular ref to hold the reference to the DOM element
  const ref = useRef<HTMLDivElement>(null);
  dropRef(ref);

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
