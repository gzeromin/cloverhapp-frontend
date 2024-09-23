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

interface CalendarHappIconProps {
  happ: Happ;
}

const CalendarHappIcon: React.FC<CalendarHappIconProps> = ({ happ }) => {
  const { user } = useAuthState();

  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  // const size = 38;

  const [{ isDragging }, dragRef] = useDrag({
    type: Dnd.MODIFIED,
    item: { id: happ.id, startTime: happ.startTime },
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
      className={cls('hover:cursor-pointer')}
    >
      <div
        key={`happ ${happ.id}`}
        className={cls('absolute flex items-start', 'group')}
        style={{ top: `${happ.positionY}%`, left: `${happ.positionX}%` }} // top 값을 계산한 퍼센트로 설정
      >
        <Image
          ref={ref}
          src={happ.UserStamp.Stamp.url}
          alt={`startTime ${happ.startTime}`}
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

export default observer(CalendarHappIcon);
