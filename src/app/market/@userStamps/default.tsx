'use client';
import { useAuthState } from '@/context/auth';
import { memo, useEffect, useState } from 'react';
import { fetcher } from '@/utils/api.util';
import useSWRInfinite from 'swr/infinite';
import { UserStamp } from '@/types/UserStamp';
import UserStampIcon from '@/components/organisms/market/UserStampIcon';
import UserStampModifyModal from '@/components/organisms/market/UserStampModifyModal';

interface Props {}

const UserStamps: React.FC<Props> = () => {
  const { user } = useAuthState();
  const [observedStamp, setObservedStamp] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUserStamp, setSelectedUserStamp] = useState<UserStamp>();

  const getKey = (pageIndex: number, previousPageData: UserStamp[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/user-stamp/page?page=${pageIndex}`;
  };

  const {
    data,
    size: page,
    setSize: setPage,
    mutate,
  } = useSWRInfinite<UserStamp[]>(getKey, fetcher);

  const userStamps: UserStamp[] = data ? ([] as UserStamp[]).concat(...data) : [];

  useEffect(() => {
    mutate();
  }, [user]);

  useEffect(() => {
    if (!userStamps || userStamps.length === 0) return;
    const id = userStamps[userStamps.length - 1].id;
    if (id !== observedStamp) {
      setObservedStamp(id);
      observeElement(document.getElementById(id));
    }
  }, [userStamps]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log('[userStamps]마지막 포스트에 왔습니다.');
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
  };

  const selectUserStamp = (userStamp: UserStamp) => {
    setSelectedUserStamp(userStamp);
    setShowModal(true);
  };

  return (
    <div>
      <div className="max-h-[75vh] overflow-y-auto grid grid-cols-3">
        {userStamps?.map((userStamp, index) => (
          <UserStampIcon
            key={`${userStamp.id} ${index}`}
            userStamp={userStamp}
            selectUserStamp={selectUserStamp}
          />
        ))}
      </div>
      {showModal && (
        <UserStampModifyModal
          userStamp={selectedUserStamp}
          closeModal={() => setShowModal(false)}
          mutateUserStamp={mutate}
        />
      )}
    </div>
  );
};

export default memo(UserStamps);
