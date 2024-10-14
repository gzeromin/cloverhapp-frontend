'use client';
import cls from 'classnames';
import { Happ, TodoStatus } from '@/types/Happ';
import { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useAuthState } from '@/context/auth';
import Image from 'next/image';
import { useDrag } from 'react-dnd';
import HappDisplayModal from '../HappDisplayModal';
import { BsCheckCircleFill } from 'react-icons/bs';
import api from '@/utils/api.util';
import { handleError } from '@/utils/error.util';
import { Dnd } from '@/enums/Dnd';
import HappSaveModal from '@/components/organisms/happCalendar/HappSaveModal';
import { HappActionEnum, useHappDispatch } from '@/context/happ';

interface CalendarHappIconProps {
  happ: Happ;
}

const iconSize = 23;

const CalendarHappIcon: React.FC<CalendarHappIconProps> = ({ happ }) => {
  const { user } = useAuthState();
  const dispatch = useHappDispatch();

  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  // const size = 38;

  const [{ isDragging }, dragRef] = useDrag({
    type: Dnd.MODIFIED_HAPP,
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

  const checkTodo = async() => {
    try {
      const res = await api.patch(
        '/happ/todo-complete/' + happ.id
      );
      dispatch(HappActionEnum.UPDATE_HAPP, {updated: res.data, created: []});
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div 
      className={cls(
        'hover:cursor-pointer',
      )}
    >
      <div
        key={`happ ${happ.id}`}
        className={cls(
          'absolute flex items-start', 
          'group'
        )}
        style={{ top: `${happ.positionY}%`, left: `${happ.positionX}%` }} // top 값을 계산한 퍼센트로 설정
      >
        {/* TODO 스탬프가 아닐 때 */}
        { happ.todo === TodoStatus.NOT_TODO && (
          <Image
            ref={ref}
            src={happ.UserStamp.Stamp.url}
            alt={`startTime ${happ.startTime}`}
            className={cls(
              'translate-x-3',
              'rounded-full object-contain aspect-square',
              'hover:bg-primary-hover',
              { 'opacity-50': isDragging },
            )}
            width={iconSize}
            height={iconSize}
            onClick={setShow}
          />
        )}
        {/* TODO 스탬프 일 때 */}
        { happ.todo === TodoStatus.TODO && (
          <Image
            ref={ref}
            src={happ.UserStamp.Stamp.url}
            alt={`startTime ${happ.startTime}`}
            className={cls(
              'translate-x-3',
              'rounded-md object-contain aspect-square',
              'hover:bg-green-100',
              { 'opacity-50': isDragging },
              'opacity-50 border border-green-600 border-dotted border-3',
            )}
            width={iconSize}
            height={iconSize}
            onClick={checkTodo}
          />
        )}
        {/* 완료 스탬프 일 때 */}
        {/* COMPLETE 상태일 때, 체크 아이콘 추가 */}
        {happ.todo === TodoStatus.COMPLETE && (
          <div className={cls('flex')}>
            <Image
              ref={ref}
              src={happ.UserStamp.Stamp.url}
              alt={`startTime ${happ.startTime}`}
              className={cls(
                'translate-x-3',
                'rounded-full object-contain aspect-square',
                'hover:bg-primary-hover',
                { 'opacity-50': isDragging },
              )}
              width={iconSize}
              height={iconSize}
              onClick={setShow}
            />
            {/* 체크 아이콘을 이미지 위에 오버레이 */}
            <BsCheckCircleFill
              className={cls('-translate-x-0 translate-y-1 font-bold text-green-600')}
              size={14} // 체크 아이콘의 크기
            />
          </div>
        )}
        {happ.memo && (
          <div className={cls(
            'ml-3 hidden group-hover:block', 
            'text-xs text-center text-gray-700',
            'border-dotted border-2 border-primary-100 rounded-lg',
            'break-all',
          )}>
            {happ.memo}
          </div>
        )}
      </div>
      {/* Happ Modify Modal */}
      {showModifyModal && (
        <HappSaveModal
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
