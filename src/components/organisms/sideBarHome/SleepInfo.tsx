'use client';
import { memo, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import { StampType } from '@/types/Stamp';
import { CounterUnit, IntervalUnit, UserStamp } from '@/types/UserStamp';
import { Happ } from '@/types/Happ';
import { 
  getAvrStartTime, 
  getAvrStartTimeForNight, 
  getGoalNumber, 
  getSleepTime
} from '@/utils/happ.util';

interface Props {
  userStamps: UserStamp[] | undefined;
  thisWeekHappList: Happ[];
  thisMonthHappList: Happ[];
}

const SleepInfo: React.FC<Props> = ({
  userStamps,
  thisWeekHappList,
  thisMonthHappList,
}) => {
  const [thisWeekWakeUp, setThisWeekWakeUp] = useState<string | null>('');
  const [thisWeekGoToBed, setThisWeekGoToBed] = useState<string | null>('');
  const [thisMonthWakeUp, setThisMonthWakeUp] = useState<string | null>('');
  const [thisMonthGoToBed, setThisMonthGoToBed] = useState<string | null>('');

  useEffect(() => {
    const weekWakeUp = getAvrStartTime(thisWeekHappList.filter(
      happ => happ.UserStamp.Stamp.type === StampType.WAKE_UP
    ));
    const weekGoToBed = getAvrStartTimeForNight(thisWeekHappList.filter(
      happ => happ.UserStamp.Stamp.type === StampType.GO_TO_BED
    ));
    const monthWakeUp = getAvrStartTime(thisMonthHappList.filter(
      happ => happ.UserStamp.Stamp.type === StampType.WAKE_UP
    ));
    const monthGoToBed = getAvrStartTimeForNight(thisMonthHappList.filter(
      happ => happ.UserStamp.Stamp.type === StampType.GO_TO_BED
    ));

    setThisWeekWakeUp(weekWakeUp || '');
    setThisWeekGoToBed(weekGoToBed || '');
    
    setThisMonthWakeUp(monthWakeUp || '');
    setThisMonthGoToBed(monthGoToBed || '');
  }, [thisWeekHappList, thisMonthHappList]);

  const getGoalSimple = (stampType: StampType) => {
    const userStamp = userStamps?.filter(e => e.Stamp.type === stampType)[0];
    if (userStamp && userStamp.existGoal) {
      return getGoalNumber(userStamp.goalUnit, userStamp.goalNumber);
    }
    return '';
  }

  const getSleepingTimeGoal = () => {
    const wakeUp = userStamps?.filter(e => e.Stamp.type === StampType.WAKE_UP)[0];
    const goToBed = userStamps?.filter(e => e.Stamp.type === StampType.GO_TO_BED)[0];
    if (wakeUp && goToBed && wakeUp.existGoal && goToBed.existGoal
      && wakeUp.goalUnit == CounterUnit.Hour && goToBed.goalUnit == CounterUnit.Hour
    ) {
      const wakeUpTime = wakeUp.goalNumber;
      const goToBedTime = goToBed.goalNumber;
      return getSleepTime(wakeUpTime, goToBedTime);
    }
    return '';
  };

  return (
    <div className="space-y-2 text-center py-1 my-2 shadow-lg bg-white rounded-md">
      {/* 1 열 */}
      <div className="flex">
        <div className="flex-[1_1_15%]"></div> {/* 작은 공간 */}
        <div className="flex-[1_1_25%]">
          <span className='text-sm bg-lime-100 rounded-full'>
            { Language.$t.Home.WakeUp }
          </span>
        </div>
        <div className="flex-[1_1_25%]">
          <span className='text-sm bg-lime-100 rounded-full'>
            { Language.$t.Home.GoToBed }
          </span>
        </div>
        <div className="flex-[1_1_35%]">
          <span className='text-sm bg-lime-100 rounded-full'>
            { Language.$t.Home.Sleeping }
          </span>
        </div>
      </div>

      {/* 2 열 */}
      <div className="flex items-center">
        <div className="flex-[1_1_15%]">
          <span className='text-sm bg-teal-100 rounded-full'>
            {Language.$t.Input.Goal}
          </span>
        </div>
        <div className="flex-[1_1_25%]">{ getGoalSimple(StampType.WAKE_UP) }</div>
        <div className="flex-[1_1_25%]">{ getGoalSimple(StampType.GO_TO_BED) }</div>
        <div className="flex-[1_1_35%]">{ getSleepingTimeGoal() }</div>
      </div>

      {/* 3 열 */}
      <div className="flex">
        <div className="flex-[1_1_15%]">
          <span className="text-sm bg-fuchsia-100 rounded-full">
            {Language.$t.Home.This}{Language.$t.Home[IntervalUnit.Week]}
          </span>
        </div>
        <div className="flex-[1_1_25%]">{ thisWeekWakeUp }</div>
        <div className="flex-[1_1_25%]">{ thisWeekGoToBed }</div>
        <div className="flex-[1_1_35%]">{ thisWeekWakeUp && thisWeekGoToBed && getSleepTime(thisWeekWakeUp, thisWeekGoToBed)}</div>
      </div>

      {/* 4 열 */}
      <div className="flex">
        <div className="flex-[1_1_15%]">
          <span className='text-sm bg-fuchsia-100 rounded-full'>
            {Language.$t.Home.This}{Language.$t.Home[IntervalUnit.Month]}
          </span>
        </div>
        <div className="flex-[1_1_25%]">{ thisMonthWakeUp }</div>
        <div className="flex-[1_1_25%]">{ thisMonthGoToBed }</div>
        <div className="flex-[1_1_35%]">{ thisMonthWakeUp && thisMonthGoToBed && getSleepTime(thisMonthWakeUp, thisMonthGoToBed)}</div>
      </div>
    </div>
  );
};

export default memo(observer(SleepInfo));