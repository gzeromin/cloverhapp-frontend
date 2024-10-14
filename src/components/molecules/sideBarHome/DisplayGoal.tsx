'use client';
import { memo } from 'react';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import { IntervalUnit, UserStamp } from '@/types/UserStamp';
import Image from 'next/image';
import { getGoalNumber } from '@/utils/happ.util';

interface Props {
  userStamp: UserStamp | undefined;
}

const DisplayGoal: React.FC<Props> = ({
  userStamp,
}) => {
  return (
    <div className='flex items-center'>
      <div className='w-1/6'>
        {userStamp && (
          <Image
            src={userStamp.Stamp.url}
            alt={`Display Goal Image ${userStamp.id}`}
            width={45}
            height={45}
            priority
          />
        )}
      </div>
      <div className={cls(
        'w-1/6',
      )}>
        <span className={cls('text-sm mx-1 bg-teal-100 rounded-full')}>
          {Language.$t.Input.Goal}
        </span>
      </div>
      {/* Goal */}
      { userStamp && userStamp.existGoal && (
        <div className={cls('flex items-center gap-1 grow justify-end mr-3')}>
          <div className={cls(
            'text-sm mx-1 bg-indigo-100 rounded-full'
          )}>
            {userStamp.goalInterval == IntervalUnit.Day && Language.$t.Statistics.Every}{Language.$t.Date[userStamp.goalInterval]}
          </div>
          <div className='text-xl'>
            { getGoalNumber(userStamp.goalUnit, userStamp.goalNumber) }
          </div>
          <div className={cls(
            'text-sm text-center'
          )}>
            <span className='mx-1 bg-blue-100 rounded-full'>
              {Language.$t.CounterUnit[userStamp.goalUnit]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(observer(DisplayGoal));