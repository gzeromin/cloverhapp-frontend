'use client';
import { memo } from 'react';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import { IntervalUnit, UserStamp } from '@/types/UserStamp';
import { Happ } from '@/types/Happ';
import { StampType } from '@/types/Stamp';
import DisplayGoal from '@/components/molecules/sideBarHome/DisplayGoal';

interface Props {
  userStamp: UserStamp | undefined;
  thisWeekHappList: Happ[];
  thisMonthHappList: Happ[];
  lastWeekHappList: Happ[];
  lastMonthHappList: Happ[];
}

const HappyStamp: React.FC<Props> = ({
  userStamp,
  thisWeekHappList,
  thisMonthHappList,
  lastWeekHappList,
  lastMonthHappList,
}) => {
  
  return (
    <div className="flex flex-col py-1 shadow-sm rounded-md">
      {/* Goal */}
      <DisplayGoal userStamp={userStamp}/>

      {/* Week */}
      <div className={cls('flex h-10 items-center')}>
        {/* This */}
        <div className={cls('flex items-center w-1/2 justify-around')}>
          <span className='text-sm mx-1 px-1 bg-fuchsia-100 rounded-full'>
            { Language.$t.Statistics.This }{Language.$t.Statistics[IntervalUnit.Week]}
          </span>
          <div className='flex'>
            <div className={cls('text-blue-700 mr-1')}>
              x
            </div>
            <div className={cls('text-2xl')}>
              {thisWeekHappList.filter((e) => e.UserStamp.Stamp.type === StampType.HAPPY).length}
            </div>
          </div>
        </div>
        {/* Last */}
        <div className={cls('flex items-center w-1/2 justify-around')}>
          <div className={cls('text-green-700 mx-1')}>
            /
          </div>
          <span className='text-sm mx-1 px-1 bg-amber-100 rounded-full'>
            { Language.$t.Statistics.Last }{Language.$t.Statistics[IntervalUnit.Week]}
          </span>
          <div className='flex'>
            <div className={cls('text-blue-700 mr-1 text-sm')}>
              x
            </div>
            <div className={cls('text-xl')}>
              {lastWeekHappList.filter((e) => e.UserStamp.Stamp.type === StampType.HAPPY).length}
            </div>
          </div>
        </div>
      </div>

      {/* Month */}
      <div className={cls('flex h-10 items-center')}>
        {/* This */}
        <div className={cls('flex items-center w-1/2 justify-around')}>
          <span className='text-sm mx-1 px-1 bg-fuchsia-100 rounded-full'>
            { Language.$t.Statistics.This }{Language.$t.Statistics[IntervalUnit.Month]}
          </span>
          <div className={cls('flex')}>
            <div className={cls('text-blue-700 mr-1')}>
              x
            </div>
            <div className='text-2xl'>
              {thisMonthHappList.filter((e) => e.UserStamp.Stamp.type === StampType.HAPPY).length}
            </div>
          </div>
        </div>
        {/* Last */}
        <div className={cls('flex items-center w-1/2 justify-around')}>
          <div className={cls('text-green-700 mx-1')}>
            /
          </div>
          <span className='text-sm mx-1 px-1 bg-amber-100 rounded-full'>
            { Language.$t.Statistics.Last }{Language.$t.Statistics[IntervalUnit.Month]}
          </span>
          <div className='flex'>
            <div className={cls('text-blue-700 mr-1 text-sm')}>
              x
            </div>
            <div className={cls('text-xl')}>
              {lastMonthHappList.filter((e) => e.UserStamp.Stamp.type === StampType.HAPPY).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(observer(HappyStamp));