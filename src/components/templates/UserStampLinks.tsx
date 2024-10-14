'use client';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import cls from 'classnames';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthState } from '@/context/auth';

interface Props {
  className?: string;
  size?: number;
}

const SideBarLinks: React.FC<Props> = ({
  className,
  size = 70,
}) => {
  const router = useRouter();
  const { userStamps } = useAuthState();
  return (
    <div 
      className={cls(
        className,
        'flex gap-3 overflow-x-auto'
      )}
    >
      {userStamps && userStamps.map((userStamp, index) =>
        <div
          key={`user stamp links ${userStamp.id} ${index}`}
          className={cls(
            'rounded-full cursor-pointer',
            'border border-gray-400 border-dashed',
            'hover:bg-primary-hover',
            'flex-shrink-0',
          )}
          onClick={() => router.push('/modalPage/create/' + userStamp.id)}
        >
          { userStamp && (
            <Image
              src={userStamp.Stamp.url}
              alt={userStamp.alias}
              className={cls(
                'rounded-full object-contain aspect-square'
              )}
              width={size}
              height={size}
              priority
            />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(observer(SideBarLinks));
