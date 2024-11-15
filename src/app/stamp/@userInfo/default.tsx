'use client';
import { memo } from 'react';
import { observer } from 'mobx-react-lite';
import { useAuthState } from '@/context/auth';
import Image from 'next/image';
import UserProrile from '@/components/molecules/UserProrile';
import cls from 'classnames';
import Link from 'next/link';
import { PiUploadDuotone } from 'react-icons/pi';

interface Props {}

const Shop: React.FC<Props> = () => {
  const { user } = useAuthState();
  return (
    <div>
      <div
        className={cls(
          'flex items-center justify-around', 
          'h-[10vh] rounded-full', 
          'border-dashed border-primary border-2'
        )}
      >
        <div className="flex flex-col items-center p-2">
          {user && (
            <UserProrile
              user={user}
              alt={'User Profile'}
              size={50}
              className="object-cover rounded-full"
            />
          )}
          <span
            className="text-gray-600"
            id="stamp-userInfo-nickname"
          >
            {user && user.nickname}
          </span>
        </div>
        <div className="w-1/2 flex justify-center">
          <p className="text-3xl text-gray-400">{user && user.droplet}</p>
          <Image
            src={'/images/icons/droplet.png'}
            alt="droplet"
            className="object-cover"
            width={30}
            height={30}
            style={{ width: 'auto' }}
          />
        </div>
        {user && user.nickname == 'aaa' &&
          <Link href="/stamp/upload">
            <PiUploadDuotone className={cls(
              'w-[40px] h-[40px] text-light-gray',
              'hover:text-primary cursor-pointer')}
            />
          </Link>
        }
      </div>
    </div>
  );
};

export default memo(observer(Shop));
