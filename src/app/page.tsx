'use client';
import { Language } from '@/mobx';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { memo } from 'react';

const pattern = 'pattern-rhombus';
const color = 'pattern-green-700';
const size = 'pattern-size-24';
const opacity = 'pattern-opacity-20';
  
const Home: React.FC = () => {
  return (
    <div className={cls(
      'h-screen flex items-center justify-center',
    )}>
      {/* Background Pattern */}
      <div
        className={`${pattern} ${color} ${size} ${opacity} pattern-bg-white fixed top-0 left-0 right-0 bottom-0`}
      />
      <Link 
        className={cls(
          'z-50',
          'text-5xl font-semibold text-gray-700',
          Language.logoFont,
          'hover:underline underline-offset-8',
          'decoration-8 decoration-dotted decoration-green-700'
        )}
        href={'/main'}
      >
        {Language.$t.Welcome}
      </Link>
    </div>
  );
};

export default memo(observer(Home));