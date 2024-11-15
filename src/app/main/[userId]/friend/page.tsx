'use client';
import { memo, useEffect, useState } from 'react';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import { useRouter } from 'next/navigation';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import useSWRInfinite from 'swr/infinite';
import { Friend } from '@/types/Friend';
import { fetcher } from '@/utils/api.util';
import FriendItem from '@/components/organisms/sideBarFriend/FriendItem';

const FriendPage: React.FC = ({}) => {
  const [observedIcon, setObservedIcon] = useState('');
  const router = useRouter();
  const getKey = (pageIndex: number, previousPageData: Friend[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/friend?page=${pageIndex}`;
  };
  const {
    data,
    size: page,
    setSize: setPage,
    mutate,
  } = useSWRInfinite<Friend[]>(getKey, fetcher);

  const friends: Friend[] = data ? ([] as Friend[]).concat(...data) : [];

  useEffect(() => {
    if (!friends || friends.length === 0) return;
    const id = friends[friends.length - 1].id;
    if (id !== observedIcon) {
      setObservedIcon(id);
      observeElement(document.getElementById(id));
    }
  }, [friends]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log('[myFriends]마지막 포스트에 왔습니다.');
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
  };


  return (
    <div className={cls(
      'flex flex-col',
      Language.logoFont
    )}>
      <div 
        className={cls('flex items-center justify-end')}
      >
        <button
          className={cls(
            'text-gray-500 text-2xl p-1 pb-0', 
            'hover:text-primary',
          )}
          onClick={() => router.push('/friend')}
        >
          <BsFillPersonPlusFill />
        </button>
      </div>
      <div className={cls(
        'h-[510px] overflow-y-auto'
      )}>
        {friends?.map((friend, index) => (
          <FriendItem
            key={`${friend.id} ${index}`}
            friend={friend}
            mutate={mutate}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(observer(FriendPage));
