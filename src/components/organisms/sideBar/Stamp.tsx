import { memo, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { UserIcon } from '@/types/UserIcon';
import { fetcher } from '@/utils/api.util';
import api from '@/utils/api.util';
import { AuthActionEnum, useAuthDispatch } from '@/context/auth';
import { Icon } from '@/types/Icon';
import { useParams } from 'next/navigation';
import SideBarStampIcon from '@/components/molecules/SideBarStampIcon';

interface Props {}

const Stamp: React.FC<Props> = () => {
  const [observedIcon, setObservedIcon] = useState('');
  const dispatch = useAuthDispatch();
  const { userId } = useParams();

  const getKey = (pageIndex: number, previousPageData: UserIcon[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/user-icon/${userId}?page=${pageIndex}`;
  };

  const {
    data,
    size: page,
    setSize: setPage,
  } = useSWRInfinite<UserIcon[]>(getKey, fetcher);

  const userIcons: UserIcon[] = data
    ? ([] as UserIcon[]).concat(
      ...data.map((e) => {
        if (e.length == 11) {
          return e.slice(0, 9);
        }
        return e;
      }),
    )
    : [];

  useEffect(() => {
    if (!userIcons || userIcons.length === 0) return;
    const id = userIcons[userIcons.length - 1].id;
    if (id !== observedIcon) {
      setObservedIcon(id);
      observeElement(document.getElementById(id));
    }
  }, [userIcons]);

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

  const onClickStamp = async (icon: Icon) => {
    try {
      const res = await api.post('/stamp', { iconId: icon.id, url: icon.url });
      dispatch(AuthActionEnum.SET_STAMP, res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[590px] overflow-y-auto" test-id="stampComponent">
      <div className="grid grid-cols-3 gap-3 p-2">
        {userIcons?.map((userIcon, index) => (
          <SideBarStampIcon
            key={`${userIcon.id} ${index}`}
            userIcon={userIcon}
            onClickStamp={() => onClickStamp(userIcon.Icon)}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(Stamp);
