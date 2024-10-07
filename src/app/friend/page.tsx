'use client';
import { fetcher } from '@/utils/api.util';
import { memo, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import FriendUser from './_FriendUser';
import { Friend } from '@/types/Friend';
import ChangeAliasModal from './_ChangeAliasModal';

interface Props {}

const FriendPage: React.FC<Props> = () => {
  const [observedIcon, setObservedIcon] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend>();
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

  const onSelectFriend = (friend: Friend) => {
    setShowModal(true);
    setSelectedFriend(friend);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="grid grid-cols-4 m-3">
      {friends?.map((friend, index) => (
        <FriendUser
          key={`${friend.id} ${index}`}
          friend={friend}
          onChangeAlias={() => onSelectFriend(friend)}
          mutate={mutate}
        />
      ))}
      {showModal && (
        <ChangeAliasModal
          friend={selectedFriend}
          closeModal={closeModal}
          mutate={mutate}
        />
      )}
    </div>
  );
};

export default memo(FriendPage);
