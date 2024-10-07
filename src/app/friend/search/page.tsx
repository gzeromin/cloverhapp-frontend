'use client';
import { Language } from '@/mobx';
import { User } from '@/types/User';
import { fetcher } from '@/utils/api.util';
import { memo, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import SearchedFriend from './_SearchedFriend';
import { BsSearch } from 'react-icons/bs';
import RequestModal from './_RequestModal';

interface Props {}

const Search: React.FC<Props> = () => {
  const [observedIcon, setObservedIcon] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFriendUser, setSelectedFriendUser] = useState<User>();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const getKey = (pageIndex: number, previousPageData: User[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/auth?page=${pageIndex}&&term=${searchTerm}`;
  };

  const {
    data,
    size: page,
    setSize: setPage,
    mutate,
  } = useSWRInfinite<User[]>(getKey, fetcher);

  const friendUsers: User[] = data ? ([] as User[]).concat(...data) : [];

  useEffect(() => {
    if (!friendUsers || friendUsers.length === 0) return;
    const id = friendUsers[friendUsers.length - 1].id;
    if (id !== observedIcon) {
      setObservedIcon(id);
      observeElement(document.getElementById(id));
    }
  }, [friendUsers]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log('[searchFriends]마지막 포스트에 왔습니다.');
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 },
    );
    observer.observe(element);
  };

  const onSelectFriendUser = (user: User) => {
    setShowModal(true);
    setSelectedFriendUser(user);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="sticky top-1 flex mx-auto items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white">
        <BsSearch className="ml-2 text-gray-400" />
        <input
          type="text"
          placeholder={Language.$t.Placeholder.SearchFriend}
          className="px-3 py-1 bg-transparent rounded h-7 focus:outline-none grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
      </div>
      <div className="grid grid-cols-4 gap-3 m-3">
        {friendUsers?.map((friendUser, index) => (
          <SearchedFriend
            key={`${friendUser.id} ${index}`}
            friendUser={friendUser}
            selectFriendUser={onSelectFriendUser}
          />
        ))}
      </div>
      {showModal && (
        <RequestModal
          friendUser={selectedFriendUser}
          closeModal={closeModal}
          mutate={mutate}
        />
      )}
    </div>
  );
};

export default memo(Search);
