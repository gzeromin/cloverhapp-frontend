'use client';
import { Language } from '@/mobx';
import { BUCKET_URL } from '@/utils/api.util';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

const pattern = 'pattern-dots';
const color = 'pattern-primary-100';
const size = 'pattern-size-32';
const opacity = 'pattern-opacity-40';
  
const Home: React.FC = () => {
  return (
    <div className={cls(
      'h-screen flex items-end md:items-center justify-center',
    )}>
      {/* Background Pattern */}
      <div
        className={`${pattern} ${color} ${size} ${opacity} pattern-bg-white fixed top-0 left-0 right-0 bottom-0`}
      />
      {/* Clover Happ Message */}
      <div
        className={cls('absolute right-8 top-24 text-2xl',
          '-z-50 text-green-600 text-end',
          Language.logoFont,
          'flex flex-col gap-4'
        )}
      >
        <div>{Language.$t.HappyStamp.Message1}</div>
        <div>{Language.$t.HappyStamp.Message2}</div>
        <div>{Language.$t.HappyStamp.Message3}</div>
        <div>{Language.$t.HappyStamp.Message4}</div>
        <div></div>
        <div>{Language.$t.HappyStamp.Message5}</div>
        <div>{Language.$t.HappyStamp.Message6}</div>
      </div>
      <div
        className={cls(
          'z-50 flex flex-col items-center justify-end gap-4',
          'text-3xl text-gray-700',
          Language.logoFont,
        )}
      >  
        <Image
          src={`${BUCKET_URL}/public/icons/happystamp.png`}
          alt="Happtamp Logo"
          width={70}
          height={70}
          priority
        />
        <p className='tracking-wide'>
          {Language.$t.Welcome}
        </p>
        <Link 
          className={cls(
            'font-semibold text-4xl mb-20',
            'hover:underline hover:text-green-700 underline-offset-8',
            'decoration-4 decoration-dotted decoration-green-700'
          )}
          href={'/main/home'}
        >
          {Language.$t.Link.GetStarted}
        </Link>
      </div> 
    </div>
  );
};

export default memo(observer(Home));