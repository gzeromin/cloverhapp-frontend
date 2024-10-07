'use client';
import { Notif } from '@/types/Notif';
import { fetcher } from '@/utils/api.util';
import { memo, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import RequestToMe from './_RequestToMe';
import { observer } from 'mobx-react-lite';

interface Props {}

const Requested: React.FC<Props> = () => {
  const [observedIcon, setObservedIcon] = useState('');

  const getKey = (pageIndex: number, previousPageData: Notif[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/notif/requested-friends?page=${pageIndex}`;
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
    <div>
      {/* <div className={cls('flex justify-around')}>
        <input type="checkbox" />
        <div className={cls('flex')}>
          <button
            className="m-1 border rounded-lg px-3 border-primary text-primary font-extralight text-lg hover:border-none hover:bg-danger hover:text-white"
            // onClick={denyFriend}
          >
            {Language.$t.Button.Deny}
          </button>
          <button
            className="m-1 border rounded-lg px-3 border-primary text-primary font-extralight text-lg hover:border-none hover:bg-success hover:text-white"
            // onClick={acceptFriend}
          >
            {Language.$t.Button.Accept}
          </button>
        </div>
      </div> */}
      {notifs?.map((notif, index) => (
        // <div className={cls('flex')} key={`${notif.id} ${index}`}>
        //   <input type="checkbox" />
        <RequestToMe
          key={`Request To Me ${notif.id} ${index}`}
          notif={notif}
          mutate={mutate}
        />
        // </div>
      ))}
    </div>
  );
};

export default memo(observer(Requested));
