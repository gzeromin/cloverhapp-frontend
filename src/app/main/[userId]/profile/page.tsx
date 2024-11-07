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
    <div className='py-1' id="profilePage">
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
      <div className={cls('flex flex-col items-center pt-1')}>
        <p className={cls('text-xl font-semibold text-gray-800')}>
          { user && user.nickname}
        </p>
        <p className={cls('text-sm text-primary')}>
          { user && user.email }
        </p>
      </div>

      <div className={cls(
        'relative flex items-center justify-center',
        'whitespace-pre-wrap', // 개행 유지
        'text-xl tracking-widest text-center',
        Language.logoFont
      )}>
        <ImQuotesLeft className='absolute -top-4 left-0 lx:left-1 xl:left-3 text-red-600' />
        <ImQuotesRight className='absolute -bottom-4 right-0 lx:right-4 xl:right-6 text-blue-600' />
        <div className={cls('h-[220px] overflow-y-auto flex items-center justify-center')}>
          { user && user.sentence }
        </div>
      </div>

      <div className={cls('absolute p-4 bottom-0 flex flex-wrap gap-2 justify-evenly')}>
        { user && user.keyValues 
          && user.keyValues.map((e, index) => <KeyValueHapp 
            key={`keyValue ${e} ${index}`} 
            value={e}
          />)}
      </div>
    </div>
  );
};

export default memo(Profile);
