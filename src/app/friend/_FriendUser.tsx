'use client';
import { useRouter } from 'next/navigation';
import { BsCalendarHeart, BsPersonSlash } from 'react-icons/bs';
import cls from 'classnames';
import { Dialog, Language, Loading } from '@/mobx/index';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import api from '@/utils/api.util';
import { Friend } from '@/types/Friend';
import { AiOutlineEdit } from 'react-icons/ai';
import UserProrile from '@/components/molecules/UserProrile';
import { handleError } from '@/utils/error.util';

interface FriendUserProps {
  friend: Friend;
  onChangeAlias: () => void;
  mutate: () => void;
}

const FriendUser: React.FC<FriendUserProps> = ({
  friend,
  onChangeAlias,
  mutate,
}) => {
  const router = useRouter();

  const deleteFriend = async () => {
    const confirmResult = await Dialog.openDialog(
      Dialog.CONFIRM,
      Language.$t.Variable.DeleteFriend.replace('{value}', friend.alias),
    );
    if (!confirmResult) {
      return;
    }

    Loading.setIsLoading(true);
    try {
      await api.delete('/friend/' + friend.friendId);
      const dialogReulst = await Dialog.openDialog(
        Dialog.SUCCESS,
        Language.$t.Success.Delete,
      );
      if (dialogReulst) {
        mutate();
      }
    } catch (error) {
      handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div
      className={cls(
        'relative m-2 p-2 border-primary-hover border border-dashed group',
        'rounded-md shadow-sm hover:shadow-lg hover:font-bold bg-white hover:border-2',
      )}
      id={friend.id}
    >
      {friend.Friend && (
        <div className={cls('w-[80px] h-[80px] mx-auto flex items-center')}>
          <UserProrile
            user={friend.Friend}
            alt={`friend list ${friend.Friend.id}`}
            size={50}
            className="h-auto w-auto object-cover aspect-square rounded-full"
          />
        </div>
      )}
      <div className="flex justify-center items-center py-1 gap-1 text-gray-400 group-hover:text-gray-600">
        <p className="text-black">{friend.alias}</p>
        <AiOutlineEdit
          className="hover:text-primary cursor-pointer rounded-md"
          style={{
            transition:
              'background-color 0.15s ease-in-out, color 0.2s ease-in-out',
          }}
          onClick={() => onChangeAlias()}
        />
      </div>
      <div
        className={cls(
          'flex justify-between gap-2 text-lg text-gray-400 shadow-sm',
          'bg-primary-hover p-1 px-2 rounded cursor-pointer group-hover:text-gray-600',
        )}
      >
        <BsCalendarHeart
          className="hover:text-primary"
          onClick={() => router.push('/c/' + friend.friendId + '/profile')}
        />
        <BsPersonSlash className="hover:text-primary" onClick={deleteFriend} />
      </div>
    </div>
  );
};

export default memo(observer(FriendUser));
