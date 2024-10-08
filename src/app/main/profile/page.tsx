'use client';
import { memo } from 'react';
import UserProrile from '@/components/molecules/UserProrile';
import { Language } from '@/mobx';
import { useAuthState } from '@/context/auth';
import cls from 'classnames';
import Link from 'next/link';
import { PiUserGearDuotone } from 'react-icons/pi';
import KeyValueHapp from '@/components/atoms/KeyValueHapp';
import { ImQuotesLeft, ImQuotesRight } from 'react-icons/im';
interface Props {}

const Profile: React.FC<Props> = () => {
  const { user } = useAuthState();

  return (
    <div className='p-1' test-id="profilePage">
      <Link 
        className={cls('flex w-full items-center justify-end h-[18px]')}
        href="/user/photo"
      >
        <PiUserGearDuotone 
          className={cls(
            'text-gray-500 cursor-pointer text-2xl', 
            'hover:text-primary',
          )}
        />
      </Link>
      {/* profile Area */}
      <div className="flex flex-col">
        <div className={cls('flex items-center justify-around flex-wrap')}>
          {/* Photo */}
          <div className={cls(
            'p-1 flex flex-col items-center justify-center', 
            'border-dashed border-primary border', 
            'rounded-full bg-white'
          )}>
            {user && (
              <UserProrile
                user={user}
                alt={'User Profile'}
                size={150}
                className="rounded-full object-cover aspect-square"
              />
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className={cls('px-4')}>
        <p className={cls('text-lg font-semibold text-gray-800')}>
          { user && user.nickname}
        </p>
        <p className={cls('text-sm text-primary')}>
          { user && user.email }
        </p>
      </div>

      <div className={cls(
        'relative',
        'whitespace-pre-wrap', // 개행 유지
        'text-xl tracking-widest text-center',
        Language.logoFont
      )}>
        <ImQuotesLeft className='absolute top-4 left-8 text-red-600' />
        <ImQuotesRight className='absolute bottom-2 right-8 text-blue-600' />
        { user && user.sentence }
      </div>

      <div className={cls('absolute p-4 bottom-4 flex flex-wrap gap-2 justify-evenly')}>
        { user && user.keyValues 
          && user.keyValues.map((e, index) => {
            const randomIndex = Math.floor(Math.random() * 11);
            return (
              <KeyValueHapp 
                key={`keyValue ${e} ${index}`} 
                value={e}
                colorNum={randomIndex}
              />
            );
          })}
      </div>
    </div>
  );
};

export default memo(Profile);
