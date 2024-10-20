'use client';
import { memo } from 'react';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import { TbSettingsShare } from 'react-icons/tb';
import GoalItem from '@/components/organisms/sideBarGoal/GoalItem';
import { useAuthState } from '@/context/auth';
import { useRouter } from 'next/navigation';

const Goal: React.FC = ({}) => {
  const { userStamps } = useAuthState();
  const router = useRouter();

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
          onClick={() => router.push('/stamp')}
        >
          <TbSettingsShare />
        </button>
      </div>
      <div className={cls(
        'h-[520px] overflow-y-auto'
      )}>
        {userStamps?.map((userStamp) => {
          if (userStamp.isDisplay && userStamp.existGoal) {
            return (
              <GoalItem
                key={`sideBarStamp userStampItem ${userStamp.id}`}
                userStamp={userStamp}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default memo(observer(Goal));
