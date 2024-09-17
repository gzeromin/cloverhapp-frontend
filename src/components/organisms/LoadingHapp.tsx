'use client';
import React, { memo, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Loading } from '@/mobx';

interface Props {}

const LoadingHapp: React.FC<Props> = () => {
  const [activeDotIndex, setActiveDotIndex] = useState(0);

  useEffect(() => {
    if (Loading.isLoading) {
      const intervalId = setInterval(() => {
        setActiveDotIndex((prevIndex) => (prevIndex + 1) % 4);
      }, 300);
      return () => clearInterval(intervalId);
    }
  }, [Loading.isLoading]);

  const clipPath =
    'polygon(50% 0%, 70% 20%, 87% 49%, 92% 68%, 83% 90%, 50% 100%, 17% 90%, 8% 68%, 13% 49%, 30% 20%)';
  const dotClassName = (index: number) =>
    `w-8 h-8 bg-primary rounded-b-full border-r-0 ${
      index === activeDotIndex ? 'opacity-100' : 'opacity-50'
    }`;
  const dotStyle = (deg: number) => {
    return {
      transform: `rotate(${deg}deg)`,
      clipPath,
      transition: 'opacity 0.5s ease-in-out',
    };
  };

  return (
    <div>
      {Loading.isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(128, 128, 128, 0.2)',
            zIndex: 40,
            visibility: Loading.isLoading ? 'visible' : 'hidden',
          }}
        >
          <div className="flex h-screen items-center justify-between">
            <div
              className="grid grid-cols-2"
              style={{ animation: 'spin 1.4s linear infinite' }}
              aria-live="polite"
              aria-busy="true"
            >
              <div
                key={0}
                className={dotClassName(0)}
                style={dotStyle(135)}
              ></div>
              <div
                key={1}
                className={dotClassName(1)}
                style={dotStyle(225)}
              ></div>
              <div
                key={3}
                className={dotClassName(3)}
                style={dotStyle(45)}
              ></div>
              <div
                key={2}
                className={dotClassName(2)}
                style={dotStyle(315)}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(observer(LoadingHapp));
