'use client';
import { memo, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import { StampType } from '@/types/Stamp';
import { CounterUnit, IntervalUnit, UserStamp } from '@/types/UserStamp';
import { Happ } from '@/types/Happ';
import { 
  getBalance, 
  getGoalCount, 
} from '@/utils/happ.util';
import DisplayGoal from '@/components/molecules/sideBarHome/DisplayGoal';

interface Props {
  incomeStamp: UserStamp | undefined;
  expenseStamp: UserStamp | undefined;
  thisWeekHappList: Happ[];
  thisMonthHappList: Happ[];
  lastWeekHappList: Happ[];
  lastMonthHappList: Happ[];
}

const MoneyInfo: React.FC<Props> = ({
  incomeStamp,
  expenseStamp,
  thisWeekHappList,
  thisMonthHappList,
  lastWeekHappList,
  lastMonthHappList
}) => {
  const [thisWeekIncome, setThisWeekIncome] = useState<number>(0);
  const [thisWeekExpense, setThisWeekExpense] = useState<number>(0);
  const [lastWeekIncome, setLastWeekIncome] = useState<number>(0);
  const [lastWeekExpense, setLastWeekExpense] = useState<number>(0);
  const [thisMonthIncome, setThisMonthIncome] = useState<number>(0);
  const [thisMonthExpense, setThisMonthExpense] = useState<number>(0);
  const [lastMonthIncome, setLastMonthIncome] = useState<number>(0);
  const [lastMonthExpense, setLastMonthExpense] = useState<number>(0);

  useEffect(() => {
    const thisWeekIncome = getGoalCount(incomeStamp?.goalUnit || CounterUnit.Won, thisWeekHappList.filter(
      happ => happ.UserStamp.Stamp.type === StampType.INCOME
    ), StampType.INCOME);
    const thisWeekExpense = getGoalCount(incomeStamp?.goalUnit || CounterUnit.Won, thisWeekHappList.filter(
      happ => happ.UserStamp.Stamp.type === StampType.EXPENSE
    ), StampType.EXPENSE);
    const lastWeekIncome = getGoalCount(incomeStamp?.goalUnit || CounterUnit.Won, lastWeekHappList.filter(
      happ => happ.UserStamp.Stamp.type === StampType.INCOME
    ), StampType.INCOME);
    const lastWeekExpense = getGoalCount(incomeStamp?.goalUnit || CounterUnit.Won, lastWeekHappList.filter(
      happ => happ.UserStamp.Stamp.type === StampType.EXPENSE
    ), StampType.EXPENSE);
    const thisMonthIncome = getGoalCount(incomeStamp?.goalUnit || CounterUnit.Won, thisMonthHappList.filter(
      happ => happ.UserStamp.Stamp.type === StampType.INCOME
    ), StampType.INCOME);
    const thisMonthExpense = getGoalCount(incomeStamp?.goalUnit || CounterUnit.Won, thisMonthHappList.filter(
      happ => happ.UserStamp.Stamp.type === StampType.EXPENSE
    ), StampType.EXPENSE);
    const lastMonthIncome = getGoalCount(incomeStamp?.goalUnit || CounterUnit.Won, lastMonthHappList.filter(
      happ => happ.UserStamp.Stamp.type === StampType.INCOME
    ), StampType.INCOME);
    const lastMonthExpense = getGoalCount(incomeStamp?.goalUnit || CounterUnit.Won, lastMonthHappList.filter(
      happ => happ.UserStamp.Stamp.type === StampType.EXPENSE
    ), StampType.EXPENSE);

    // this week
    setThisWeekIncome(thisWeekIncome);
    setThisWeekExpense(thisWeekExpense);
    // last week
    setLastWeekIncome(lastWeekIncome);
    setLastWeekExpense(lastWeekExpense);
    // this month
    setThisMonthIncome(thisMonthIncome);
    setThisMonthExpense(thisMonthExpense);
    // this month
    setLastMonthIncome(lastMonthIncome);
    setLastMonthExpense(lastMonthExpense);
  }, [thisWeekHappList, thisMonthHappList, lastWeekHappList, lastMonthHappList]);

  return (
    <div className="space-y-1 text-center shadow-lg py-1 bg-white rounded-md">
      {/* 1 열 */}
      <DisplayGoal userStamp={incomeStamp}/>
      {/* 2 열 */}
      <DisplayGoal userStamp={expenseStamp}/>
      {/* 3 열 */}
      <div className="flex">
        <div className="flex-[1_1_15%]">
          {}
        </div>
        <div className="flex-[1_1_25%]">
          <span className='text-sm bg-lime-100 rounded-full'>
            { Language.$t.Home.Income }
          </span>
        </div>
        <div className="flex-[1_1_25%]">
          <span className='text-sm bg-lime-100 rounded-full'>
            { Language.$t.Home.Expense }
          </span>
        </div>
        <div className="flex-[1_1_35%]">
          <span className='text-sm bg-lime-100 rounded-full'>
            { Language.$t.Home.Balance }
          </span>
        </div>
      </div>

      {/* 4 열 */}
      <div className="flex">
        <div className="flex-[1_1_15%]">
          <span className="text-sm bg-fuchsia-100 rounded-full">
            {Language.$t.Home.This}{Language.$t.Home[IntervalUnit.Week]}
          </span>
        </div>
        <div className="flex-[1_1_25%]">{ thisWeekIncome }</div>
        <div className="flex-[1_1_25%]">{ thisWeekExpense }</div>
        <div className="flex-[1_1_35%]">{ getBalance(thisWeekIncome, thisWeekExpense)}</div>
      </div>

      {/* 5 열 */}
      <div className="flex">
        <div className="flex-[1_1_15%]">
          <span className="text-sm bg-amber-100 rounded-full">
            {Language.$t.Home.Last}{Language.$t.Home[IntervalUnit.Week]}
          </span>
        </div>
        <div className="flex-[1_1_25%]">{ lastWeekIncome }</div>
        <div className="flex-[1_1_25%]">{ lastWeekExpense }</div>
        <div className="flex-[1_1_35%]">{ getBalance(lastWeekIncome, lastWeekExpense)}</div>
      </div>

      {/* Last Month */}
      <div className="flex">
        <div className="flex-[1_1_15%]">
          <span className='text-sm bg-amber-100 rounded-full'>
            {Language.$t.Home.Last}{Language.$t.Home[IntervalUnit.Month]}
          </span>
        </div>
        <div className="flex-[1_1_25%]">{ lastMonthIncome }</div>
        <div className="flex-[1_1_25%]">{ lastMonthExpense }</div>
        <div className="flex-[1_1_35%]">{ getBalance(lastMonthIncome, lastMonthExpense)}</div>
      </div>

      {/* This Month */}
      <div className="flex">
        <div className="flex-[1_1_15%]">
          <span className='text-sm bg-fuchsia-100 rounded-full'>
            {Language.$t.Home.This}{Language.$t.Home[IntervalUnit.Month]}
          </span>
        </div>
        <div className="flex-[1_1_25%]">{ thisMonthIncome }</div>
        <div className="flex-[1_1_25%]">{ thisMonthExpense }</div>
        <div className="flex-[1_1_35%]">{ getBalance(thisMonthIncome, thisMonthExpense)}</div>
      </div>

    </div>
  );
};

export default memo(observer(MoneyInfo));