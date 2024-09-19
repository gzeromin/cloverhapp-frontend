'use client';
import { UserStamp } from '@/types/UserStamp';
import Image from 'next/image';
import cls from 'classnames';

interface UserStampIconProps {
  userStamp: UserStamp;
  selectUserStamp: (userStamp: UserStamp) => void;
}

const UserStampIcon: React.FC<UserStampIconProps> = ({
  userStamp,
  selectUserStamp,
}) => {
  return (
    <div
      className="p-2"
      id={userStamp.id}
      onClick={() => selectUserStamp(userStamp)}
    >
      <div className={cls('relative p-3 cursor-pointer rounded-md shadow-sm', 
        'border-primary-hover border border-dashed', 
        'bg-white group hover:border-2 hover:font-bold hover:shadow-lg')}>
        <Image
          src={userStamp.Stamp.url}
          alt={`stamp user icon ${userStamp.Stamp.id}`}
          className={cls('h-auto w-auto mx-auto pt-1 object-contain aspect-square')}
          priority
          width={50}
          height={50}
        />
        <p className={cls(
          'text-center truncate pt-2',
          'group-hover:text-wrap group-hover:whitespace-normal'
        )}>{userStamp.alias}</p>
      </div>
    </div>
  );
};

export default UserStampIcon;
