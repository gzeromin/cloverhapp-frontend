'use client';
import { useEffect, useState } from 'react';
import cls from 'classnames';
import { colorPalette } from '../atoms/KeyValueHapp';
import { Happ } from '@/types/Happ';
import Image from 'next/image';
import UserProrile from '../molecules/UserProrile';
import HappDisplayModal from './HappDisplayModal';

interface Props {
  className?: string;
  happs: Happ[];
}

const FloatingBubbles: React.FC<Props> = ({ className, happs }) => {
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [positions, setPositions] = useState<{ top: number; left: number }[]>([]);
  const [hoverPositions, setHoverPositions] = useState<{ top: number; left: number }[]>([]);
  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [displayHappId, setDisplayHappId] = useState<string | null>(null);

  useEffect(() => {
    const newPositions = happs.map(() => ({
      top: Math.random() * 80 + 10,  // 랜덤한 top 위치 (10% - 90%)
      left: Math.random() * 90,      // 랜덤한 left 위치 (0% - 90%)
    }));
    setPositions(newPositions);
    setHoverPositions(newPositions); // 처음엔 hover 위치도 기본으로 설정
  }, [happs]);

  const handleDelayedMouseEnter = (index: number) => {
    const randomTop = Math.random() * 30 - 15;  // -25% ~ +25% 이동
    const randomLeft = Math.random() * 30 - 15; // -25% ~ +25% 이동
    setHoverPositions((prev) => {
      const updated = [...prev];
      updated[index] = {
        top: positions[index].top + randomTop,
        left: positions[index].left + randomLeft,
      };
      // Clear the timer if the mouse leaves before 3 seconds
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      return updated;
    });
  };

  const handleMouseEnter = (index) => {
    const timeoutId = setTimeout(() => {
      handleDelayedMouseEnter(index);
    }, 500); // 1000 ms = 1 seconds
  
    setHoverTimeout(timeoutId);
  };

  const handleMouseClick = (happId: string) => {
    setDisplayHappId(happId);
    setShowDisplayModal(true);
  };

  return (
    <div className={cls(
      'relative w-full h-screen overflow-hidden',
      className
    )}>
      {happs.map((happ, index) => {
        const randomIndex = Math.floor(Math.random() * 11);
        const color = colorPalette[randomIndex];
        const user = happ.User;
        const maxlength = 150;
        const memo = happ.memo && happ.memo.length > maxlength ? `${happ.memo.slice(0, maxlength)}...`: happ.memo;
        const size = memo ? 30 + Math.log2(memo.length) * 45 : 75;
        return (
          <div
            key={index}
            className={cls(
              'absolute p-3 rounded-full text-white text-center shadow-lg',
              'bg-blue-400 animate-float transition-all duration-1000 ease-in-out',
              'border rounded-[4px]',
              'flex items-center justify-center flex-wrap break-all',
              'hover:z-50'
            )}
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleMouseClick(happ.id)}
            style={{
              top: `${hoverPositions[index]?.top}%`,
              left: `${hoverPositions[index]?.left}%`,
              transform: 'translate(-50%, -50%)',
              color: color.text,
              backgroundColor: color.bg,
              borderColor: color.text,
              width: size,
              height: size,
            }}
          >
            <div className={cls(
              'absolute -top-3 left-1/4',
              'flex text-xs',
            )}>
              <UserProrile
                user={user}
                alt={`happ list user ${happ.id} ${user?.id}`}
                size={25}
                className='rounded-full aspect-square object-cover'
              />
              {user.nickname}
            </div>
            <div className='flex flex-col items-center'>
              <Image
                src={happ.UserStamp.Stamp.url}
                alt={happ.UserStamp.alias}
                className={cls('rounded-full object-contain aspect-square')}
                width={50}
                height={50}
                priority
              />
              {memo}
            </div>
          </div>
        );
      })}
      {/* Stamp Display Modal */}
      {showDisplayModal && (
        <HappDisplayModal
          happId={displayHappId}
          closeModal={() => setShowDisplayModal(false)}
        />
      )}
    </div>
  );
};

export default FloatingBubbles;
