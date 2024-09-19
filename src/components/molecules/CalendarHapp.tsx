'use client';
import cls from 'classnames';
import { Happ } from '@/types/Happ';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import HappModifyModal from './HappModifyModal';
import HappDisplayModal from './HappDisplayModal';
import Image from 'next/image';
import { useAuthState } from '@/context/auth';

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
  const positionY = ((hours - 4) / 24) * 96;
  // 시간 비율을 계산 (한시간 60분 기준)
  const positionX = (minutes / 60) * 50;

  const setShow = () => {
    if (user && user.id == happ.userId) {
      setShowModifyModal(true);
    } else {
      setShowDisplayModal(true);
    }
  };
  return (
    <div className="hover:cursor-pointer">
      <div 
        key={`happ ${happ.id}`}
        className={cls('absolute flex items-start', 'group')}
        style={{ top: `${positionY}%`, left: `${positionX}%` }} // top 값을 계산한 퍼센트로 설정
      >
        <Image
          src={`https://elasticbeanstalk-us-east-1-149536466661.s3.amazonaws.com/cloverhapp/${happ.id}.png`}
          alt={`happedAt ${happ.happedAt}`}
          className={cls('translate-x-3', 'rounded-full object-contain aspect-square hover:bg-primary-hover')}
          width={33}
          height={33}
          onClick={setShow}
          priority
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
