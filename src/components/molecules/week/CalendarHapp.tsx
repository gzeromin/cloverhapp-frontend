'use client';
import cls from 'classnames';
import { Dnd, Happ } from '@/types/Happ';
import { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useAuthState } from '@/context/auth';
import Image from 'next/image';
import { useDrag } from 'react-dnd';
import HappModifyModal from '../HappModifyModal';
import HappDisplayModal from '../HappDisplayModal';

interface CalendarHappProps {
  happ: Happ;
}

const CalendarHapp: React.FC<CalendarHappProps> = ({ happ }) => {
  const { user } = useAuthState();

  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  // const size = 38;

  const happedAt = new Date(happ.happedAt);
  const hours = happedAt.getHours();
  const minutes = happedAt.getMinutes();

  // 시간 비율을 계산 (하루 24시간 기준)
  let positionY = hours - 4;
  if (positionY <= 0) {
    positionY = positionY + 24;
  }
  positionY = (positionY / 24) * 94;
  // 시간 비율을 계산 (한시간 60분 기준)
  const positionX = (minutes / 60) * 50;

  const [{ isDragging }, dragRef] = useDrag({
    type: Dnd.MODIFIED,
    item: { id: happ.id, happedAt },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const ref = useRef<HTMLImageElement>(null);
  dragRef(ref);

  const setShow = () => {
    if (user && user.id == happ.userId) {
      setShowModifyModal(true);
    } else {
      setShowDisplayModal(true);
    }
  };
  return (
    <div 
      className={cls('hover:cursor-pointer bg-transparent')}
    >
      <div
        key={`happ ${happ.id}`}
        className={cls('absolute flex items-start', 'group', 'bg-transparent')}
        style={{ top: `${positionY}%`, left: `${positionX}%` }} // top 값을 계산한 퍼센트로 설정
      >
        <Image
          ref={ref}
          src={happ.UserStamp.Stamp.url}
          alt={`happedAt ${happ.happedAt}`}
          className={cls(
            'translate-x-3',
            'rounded-full object-contain aspect-square',
            'hover:bg-primary-hover',
            { 'opacity-50': isDragging }
          )}
          width={33}
          height={33}
          onClick={setShow}
            
        />
        <div className={cls(
          'ml-3 hidden group-hover:block', 
          'text-xs text-center text-gray-700',
          'border-dotted border-2 border-primary-100 rounded-lg',
          'break-all',
        )}>
          {happ.memo}
        </div>
      </div>
      {/* Happ Modify Modal */}
      {showModifyModal && (
        <HappModifyModal
          happId={happ.id}
          closeModal={() => setShowModifyModal(false)}
        />
      )}

      {/* Happ Display Modal */}
      {showDisplayModal && (
        <HappDisplayModal
          happId={happ.id}
          closeModal={() => setShowDisplayModal(false)}
        />
      )}
    </div>
  );
};

export default observer(CalendarHapp);
