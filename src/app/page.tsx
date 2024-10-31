'use client';
import FloatingBubbles from '@/components/organisms/FloatingBubbles';
import { Language } from '@/mobx';
import { Happ } from '@/types/Happ';
import { fetcher } from '@/utils/api.util';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { memo } from 'react';
import useSWRInfinite from 'swr/infinite';

const pattern = 'pattern-dots';
const color = 'pattern-primary-100';
const size = 'pattern-size-32';
const opacity = 'pattern-opacity-40';
  
const Home: React.FC = () => {
  const getKey = (pageIndex: number, previousPageData: Happ[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/happ/list/user?page=${pageIndex}`;
  };

  const {
    data: happData,
  } = useSWRInfinite<Happ[]>(getKey, fetcher);

  const happs: Happ[] = happData ? ([] as Happ[]).concat(...happData) : [];

  return (
    <div className={cls(
      'h-screen flex items-end md:items-center justify-center',
    )}>
      {/* Background Pattern */}
      <div
        className={`${pattern} ${color} ${size} ${opacity} pattern-bg-white fixed top-0 left-0 right-0 bottom-0`}
      />
      <FloatingBubbles happs={happs} />
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
          'z-50 flex absolute flex-col items-center gap-4',
          'text-3xl text-gray-700',
          Language.logoFont,
        )}
      >  
        <Image
          src={'/images/icons/happystamp.png'}
          alt="Happtamp Logo"
          width={70}
          height={70}
          priority
        />
        <p className='tracking-wide'>
          {Language.$t.Welcome}
        </p>
      </div> 
    </div>
  );
};

export default memo(observer(Home));