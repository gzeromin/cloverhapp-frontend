'use client';
import { memo, useEffect, useState } from 'react';
import { UserStamp } from '@/types/UserStamp';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import UserStampItem from '@/components/organisms/stamp/UserStampItem';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAuthState } from '@/context/auth';
import api from '@/utils/api.util';

const UserStamps: React.FC = () => {
  const { user } = useAuthState();
  const [displayStamps, setDisplayStamps] = useState<UserStamp[]>([]);
  const [hiddenStamps, setHiddenStamps] = useState<UserStamp[]>([]);
  
  useEffect(() => {
    api.get('/user-stamp').then((res) => {
      const userStamps = res.data;
      setDisplayStamps(userStamps.filter(e => e.isDisplay));
      setHiddenStamps(userStamps.filter(e => !e.isDisplay));
    });
  }, [user]);

  return (
    <div className={cls(
      'flex flex-col p-1',
    )}>
      {/* 표시할 스탬프 userStamp.isDisplay = true */}
      <div className={cls('flex items-center justify-center gap-1')}>
        <AiOutlineEye />
        {Language.$t.SideBarMessage.Stamp.Display}
      </div>
      <div
        className={cls(
          'overflow-y-auto',
          'h-[40vh] bg-white'
        )}
      >
        {displayStamps.map((userStamp) => (
          <UserStampItem
            key={userStamp.id}
            userStamp={userStamp}
            isDisplay={true}
          />
        ))}
      </div>

      {/* 표시 안 할 스탬프 userStamp.isDisplay = false */}
      <div className={cls(
        'flex items-center justify-center gap-1 mt-4'
      )}>
        <AiOutlineEyeInvisible />
        {Language.$t.SideBarMessage.Stamp.NotDisplay}
      </div>
      <div
        className={cls(
          'overflow-y-auto',
          'h-[25vh] bg-gray-50'
        )}
      >
        {hiddenStamps.map((userStamp) => (
          <UserStampItem
            key={userStamp.id}
            userStamp={userStamp}
            isDisplay={false}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(observer(UserStamps));
