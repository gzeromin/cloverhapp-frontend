'use client';
import { memo } from 'react';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import { TbSettingsShare } from 'react-icons/tb';
import Link from 'next/link';
import useSWR from 'swr';
import { UserStamp } from '@/types/UserStamp';
import { fetcher } from '@/utils/api.util';
import UserStampItem from '@/components/organisms/sideBarStamp/UserStampItem';

const StampPage: React.FC = ({}) => {
  const { 
    data,
  } = useSWR<UserStamp[]>('/user-stamp/display', fetcher);

  return (
    <div className={cls(
      'flex flex-col p-1',
      Language.logoFont
    )}>
      <Link 
        className={cls('flex w-full items-center justify-end h-[18px]')}
        href="/stamp"
      >
        <TbSettingsShare 
          className={cls(
            'text-gray-500 cursor-pointer text-2xl', 
            'hover:text-primary',
          )}
        />
      </Link>
      <div className={cls(
        'h-[520px] overflow-y-auto'
      )}>
        {data?.map((userStamp) => {
          return (
            <UserStampItem
              key={`sideBarStamp userStampItem ${userStamp.id}`}
              userStamp={userStamp}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(observer(StampPage));
