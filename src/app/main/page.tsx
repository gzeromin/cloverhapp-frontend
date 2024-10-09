'use client';
import { memo, useEffect, useState } from 'react';
import { useAuthState } from '@/context/auth';
import {
  getLastMonthHapp,
  getLastWeekHapp,
  getThisMonthHapp, 
  getThisWeekHapp, 
} from '@/utils/happ.util';
import { StampType } from '@/types/Stamp';
import { TimeCtrllor } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { fetcher } from '@/utils/api.util';
import { Happ } from '@/types/Happ';
import useSWR from 'swr';
import { UserStamp } from '@/types/UserStamp';
import SleepInfo from '@/components/organisms/sideBarHome/SleepInfo';
import HappyStamp from '@/components/organisms/sideBarHome/HappyStamp';
import MoneyInfo from '@/components/organisms/sideBarHome/MoneyInfo';

const Main: React.FC = () => {
  const { happList } = useAuthState();
  const { data: userStamps } = useSWR<UserStamp[]>('/user-stamp', fetcher);
  const [thisWeekHappList, setThisWeekHappList] = useState<Happ[]>([]);
  const [thisMonthHappList, setThisMonthHappList] = useState<Happ[]>([]);
  const [lastWeekHappList, setLastWeekHappList] = useState<Happ[]>([]);
  const [lastMonthHappList, setLastMonthHappList] = useState<Happ[]>([]);

  useEffect(() => {
    if (happList) {
      const selectedDate = TimeCtrllor.selectedDate;
      setThisWeekHappList(getThisWeekHapp(happList, selectedDate));
      setThisMonthHappList(getThisMonthHapp(happList, selectedDate));
      setLastWeekHappList(getLastWeekHapp(happList, selectedDate));
      setLastMonthHappList(getLastMonthHapp(happList, selectedDate));
    }
  }, [happList, TimeCtrllor.selectedDate]);

  return (
    <div className="h-[540px] overflow-y-auto container mx-auto p-2">
      <div className="grid grid-cols-1 gap-1">
        {/* 이번주 해피스탬프 */}
        <HappyStamp 
          userStamp={userStamps?.filter(e => e.Stamp.type === StampType.HAPPY)[0]}
          thisWeekHappList={thisWeekHappList}
          thisMonthHappList={thisMonthHappList}
          lastWeekHappList={lastWeekHappList}
          lastMonthHappList={lastMonthHappList}
        />

        {/* 수면 */}
        <SleepInfo 
          userStamps={userStamps}
          thisWeekHappList={thisWeekHappList}
          thisMonthHappList={thisMonthHappList}
        />

        {/* 이번달 수입/지출 */}
        <MoneyInfo
          incomeStamp={userStamps?.filter(e => e.Stamp.type === StampType.INCOME)[0]}
          expenseStamp={userStamps?.filter(e => e.Stamp.type === StampType.EXPENSE)[0]}
          thisWeekHappList={thisWeekHappList}
          thisMonthHappList={thisMonthHappList}
          lastWeekHappList={lastWeekHappList}
          lastMonthHappList={lastMonthHappList}
        />
      </div>
    </div>
  );
};

export default memo(observer(Main));
