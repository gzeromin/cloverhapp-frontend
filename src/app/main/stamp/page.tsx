'use client';
import { memo, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { UserStamp } from '@/types/UserStamp';
import { fetcher } from '@/utils/api.util';
import api from '@/utils/api.util';
import { AuthActionEnum, useAuthDispatch } from '@/context/auth';
import { useParams } from 'next/navigation';
import SideBarStamp from '@/components/molecules/SideBarStamp';
import { Stamp } from '@/types/Stamp';

interface Props {}

const StampPage: React.FC<Props> = () => {
  const [observedStamp, setObservedStamp] = useState('');
  const dispatch = useAuthDispatch();
  const { userId } = useParams();

  const getKey = (pageIndex: number, previousPageData: UserStamp[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/user-stamp/${userId}?page=${pageIndex}`;
  };

  const {
    data,
    size: page,
    setSize: setPage,
  } = useSWRInfinite<UserStamp[]>(getKey, fetcher);

  const userStamps: UserStamp[] = data
    ? ([] as UserStamp[]).concat(
      ...data.map((e) => {
        if (e.length == 11) {
          return e.slice(0, 9);
        }
        return e;
      }),
    )
    : [];

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
          console.log('[purchase]마지막 포스트에 왔습니다.');
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
  };

  const onClickStamp = async (stamp: Stamp) => {
    try {
      const res = await api.post('/happ', { stampId: stamp.id, url: stamp.url });
      dispatch(AuthActionEnum.SET_HAPP, res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[590px] overflow-y-auto" test-id="stampPage">
      <div className="grid grid-cols-3 gap-3 p-2">
        {userStamps?.map((userStamp, index) => (
          <SideBarStamp
            key={`${userStamp.id} ${index}`}
            userStamp={userStamp}
            onClickStamp={() => onClickStamp(userStamp.Stamp)}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(StampPage);
