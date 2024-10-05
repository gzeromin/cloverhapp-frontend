'use client';
import cls from 'classnames';
import {
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
  useState,
} from 'react';
import { LuAtSign } from 'react-icons/lu';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx/index';
import { Friend } from '@/types/Friend';
import useSWRInfinite from 'swr/infinite';
import { fetcher } from '@/utils/api.util';
import UserProrile from '../molecules/UserProrile';
import { RiCloseLine } from 'react-icons/ri';

interface AddFriendsHappProps {
  className?: string;
  friends: Friend[];
  setFriends: Dispatch<SetStateAction<Friend[]>>;
}

const AddFriendsHapp: React.FC<AddFriendsHappProps> = ({
  className,
  friends,
  setFriends,
}) => {
  const [observedIcon, setObservedIcon] = useState('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFriends, setShowFriends] = useState(false);

  const getKey = (pageIndex: number, previousPageData: Friend[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/friend?page=${pageIndex}&&term=${searchTerm}`;
  };

  const {
    data,
    size: page,
    setSize: setPage,
  } = useSWRInfinite<Friend[]>(getKey, fetcher);

  const friendList: Friend[] = data
    ? ([] as Friend[])
      .concat(...data)
      .filter((d) => !friends.some((f) => f.id === d.id))
    : [];

  useEffect(() => {
    if (!friendList || friendList.length === 0) return;
    const id = friendList[friendList.length - 1].id;
    if (id !== observedIcon) {
      setObservedIcon(id);
      observeElement(document.getElementById(id));
    }
  }, [friendList]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log('[addFriends]마지막 포스트에 왔습니다.');
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 },
    );
    observer.observe(element);
  };

  const addFriend = (friend: Friend) => {
    setFriends((prev: Friend[]) => {
      return [...prev, friend];
    });
    setSearchTerm('');
  };

  const deleteFriend = (friend: Friend) => {
    setFriends((prev: Friend[]) => {
      return prev.filter((e) => e.id !== friend.id);
    });
  };
  return (
    <div
      className={`relative flex items-end justify-between py-1 ${className}`}
    >
      <div className={cls(
        'flex flex-wrap gap-1 shadow-md rounded-md',
        'max-h-[90px] overflow-y-auto'
      )}>
        {friends?.map((friend, index) => (
          <div
            key={`friendList ${friend.id} ${index}`}
            className="flex px-1 rounded-full bg-gray-100 items-center justify-between group hover:bg-green-100 cursor-pointer"
            onClick={() => deleteFriend(friend)}
          >
            <UserProrile
              user={friend.Friend}
              alt={`friendList userProfile ${friend.id} ${index}`}
              size={30}
              className="rounded-full"
            />
            <span className="text-sm mr-1">{friend.alias}</span>
            <RiCloseLine className="text-sm mr-1 group-hover:text-green-700 group-hover:font-extrabold" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1">
        <LuAtSign className={cls(
          'text-gray-500 text-xl',
          { 'text-green-700': showFriends }
        )} />
        <input
          type="text"
          placeholder={Language.$t.Placeholder.AddFriend}
          className="w-[150px] focus:outline-none rounded text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          onFocus={() => setShowFriends(true)}
          onBlur={() => setTimeout(() => setShowFriends(false), 100)}
        />
      </div>
      {showFriends && (
        <div
          className={cls(
            'absolute right-0 bottom-0 translate-x-2 -translate-y-7',
            'w-[170px] max-h-[150px] break-all overflow-y-auto rounded shadow-md',
            'bg-white border-collapse',
          )}
        >
          {friendList?.map((friend, index) => (
            <div
              key={`friends ${friend.id} ${index}`}
              id={friend.id}
              className={cls(
                'flex items-center hover:bg-green-50 cursor-pointer',
                'hover:font-bold gap-1 p-1 min-h-[35px]'
              )}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent the blur event
                addFriend(friend);
              }}
            >
              <UserProrile
                user={friend.Friend}
                alt={`friends userProfile ${friend.id} ${index}`}
                size={35}
                className="rounded-full"
              />
              <span className="text-xs">{friend.alias}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(observer(AddFriendsHapp));
