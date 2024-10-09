'use client';
import { Notif } from '@/types/Notif';
import { fetcher } from '@/utils/api.util';
import { memo, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import MyRequesting from './_MyRequesting';

interface Props {}

const Requesting: React.FC<Props> = () => {
  const [observedIcon, setObservedIcon] = useState('');

  const getKey = (pageIndex: number, previousPageData: Notif[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/notif/requesting-friends?page=${pageIndex}`;
  };

  const {
    data,
    size: page,
    setSize: setPage,
    mutate,
  } = useSWRInfinite<Notif[]>(getKey, fetcher);

  const notifs: Notif[] = data ? ([] as Notif[]).concat(...data) : [];

  useEffect(() => {
    if (!notifs || notifs.length === 0) return;
    const id = notifs[notifs.length - 1].id;
    if (id !== observedIcon) {
      setObservedIcon(id);
      observeElement(document.getElementById(id));
    }
  }, [notifs]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log('[requesting]마지막 포스트에 왔습니다.');
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
  };

  // const onSelectFriendUser = (friendUser: User) => {};

  return (
    <div className="">
      {notifs?.map((notif, index) => (
        <MyRequesting
          key={`My Requesting ${notif.id} ${index}`}
          notif={notif}
          mutate={mutate}
        />
      ))}
    </div>
  );
};

export default memo(Requesting);
