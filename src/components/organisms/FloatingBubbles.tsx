'use client';
import { useEffect, useState } from 'react';
import cls from 'classnames';
import { colorPalette } from '../atoms/KeyValueHapp';
import { Happ } from '@/types/Happ';
import Image from 'next/image';

interface Props {
  happs: Happ[];
}

const FloatingBubbles: React.FC<Props> = ({ happs }) => {
  const [positions, setPositions] = useState<{ top: number; left: number }[]>([]);
  const [hoverPositions, setHoverPositions] = useState<{ top: number; left: number }[]>([]);

  useEffect(() => {
    const newPositions = happs.map(() => ({
      top: Math.random() * 80 + 10,  // 랜덤한 top 위치 (10% - 90%)
      left: Math.random() * 90,      // 랜덤한 left 위치 (0% - 90%)
    }));
    setPositions(newPositions);
    setHoverPositions(newPositions); // 처음엔 hover 위치도 기본으로 설정
  }, [happs]);

  const handleMouseEnter = (index: number) => {
    const randomTop = Math.random() * 30 - 15;  // -25% ~ +25% 이동
    const randomLeft = Math.random() * 30 - 15; // -25% ~ +25% 이동
    setHoverPositions((prev) => {
      const updated = [...prev];
      updated[index] = {
        top: positions[index].top + randomTop,
        left: positions[index].left + randomLeft,
      };
      return updated;
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {happs.map((happ, index) => {
        const randomIndex = Math.floor(Math.random() * 11);
        const color = colorPalette[randomIndex];
        if (happ.memo) {
          const memo = happ.memo;
          const size = Math.log2(memo.length) * 45 - 55;
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
              {memo}
            </div>
          );
        } else {
          const size = 75;
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
              <Image
                src={happ.UserStamp.Stamp.url}
                alt={happ.UserStamp.alias}
                className={cls('rounded-full object-contain aspect-square')}
                width={size}
                height={size}
                priority
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export default FloatingBubbles;
