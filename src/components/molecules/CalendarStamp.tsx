'use client';
import cls from 'classnames';
import { Stamp } from '@/types/Stamp';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import StampModifyModal from './StampModifyModal';
import StampDisplayModal from './StampDisplayModal';
import Image from 'next/image';
import { useAuthState } from '@/context/auth';

interface CalendarStampProps {
  stamp: Stamp;
}

const CalendarStamp: React.FC<CalendarStampProps> = ({ stamp }) => {
  const { user } = useAuthState();

  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  // const size = 38;

  const stampedAt = new Date(stamp.stampedAt);
  const hours = stampedAt.getHours();
  const minutes = stampedAt.getMinutes();

  // 시간 비율을 계산 (하루 24시간 기준)
  const positionY = ((hours - 4) / 24) * 96;
  // 시간 비율을 계산 (한시간 60분 기준)
  const positionX = (minutes / 60) * 50;

  const setShow = () => {
    if (user && user.id == stamp.userId) {
      setShowModifyModal(true);
    } else {
      setShowDisplayModal(true);
    }
  };
  return (
    <div className="hover:cursor-pointer">
      <div 
        key={`stamp ${stamp.id}`}
        className={cls('absolute flex items-start', 'group')}
        style={{ top: `${positionY}%`, left: `${positionX}%` }} // top 값을 계산한 퍼센트로 설정
      >
        <Image
          src={`https://elasticbeanstalk-us-east-1-149536466661.s3.amazonaws.com/cloverhapp/${stamp.stampName}.png`}
          alt={`stampedAt ${stamp.stampedAt} ${stamp.stampName}`}
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
          {stamp.memo}
        </div>
      </div>
      {/* Stamp Modify Modal */}
      {showModifyModal && (
        <StampModifyModal
          stampId={stamp.id}
          closeModal={() => setShowModifyModal(false)}
        />
      )}

      {/* Stamp Display Modal */}
      {showDisplayModal && (
        <StampDisplayModal
          stampId={stamp.id}
          closeModal={() => setShowDisplayModal(false)}
        />
      )}
    </div>
  );
};

export default observer(CalendarStamp);
