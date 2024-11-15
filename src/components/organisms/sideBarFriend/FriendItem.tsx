'use client';
import { BsCalendarHeart } from 'react-icons/bs';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import { Friend } from '@/types/Friend';
import UserProrile from '@/components/molecules/UserProrile';

interface Props {
  friend: Friend;
  mutate: () => void;
}

const FriendItem: React.FC<Props> = ({
  friend,
}) => {
  return (
    <div className={cls(
      'flex items-center justify-between m-1 p-1',
      'bg-white bg-opacity-50 rounded-lg shadow-sm',
      'border-primary-hover border border-dashed',
      'group'
    )}>
      <div className={cls(
        'flex items-center gap-1'
      )}>
        <UserProrile
          user={friend.Friend}
          alt={`friend list ${friend.Friend.id}`}
          size={40}
          className="h-auto w-auto object-cover aspect-square rounded-full"
        />
        <p className="text-black">{friend.alias}</p>
      </div>
      <BsCalendarHeart
        className={cls(
          'text-lg text-gray-400 shadow-sm',
          'rounded cursor-not-allowed group-hover:text-gray-600',
          'hover:text-primary'
        )}
      />
    </div>
  );
};

export default memo(observer(FriendItem));
