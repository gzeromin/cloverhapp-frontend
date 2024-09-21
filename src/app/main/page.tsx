'use client';
import { memo, useEffect, useState } from 'react';
import { useAuthState } from '@/context/auth';
import { getAvrHappedAt, getLastSevenDaysHapp, getSleepTime, getThisMonthHapp, getThisWeekHapp } from '@/utils/happ.util';
import { StampType } from '@/types/Stamp';
import { TimeCtrllor } from '@/mobx';
import { observer } from 'mobx-react-lite';

const Main: React.FC = () => {
  const { happList } = useAuthState();

  const [thisWeekWakeUp, setThisWeekWakeUp] = useState<string | null>(null);
  const [thisWeekGoToBed, setThisWeekGoToBed] = useState<string | null>(null);
  const [thisWeekSleeping, setThisWeekSleeping] = useState<string | null>(null);
  
  const [thisMonthWakeUp, setThisMonthWakeUp] = useState<string | null>(null);
  const [thisMonthGoToBed, setThisMonthGoToBed] = useState<string | null>(null);
  const [thisMonthSleeping, setThisMonthSleeping] = useState<string | null>(null);

  const [thisWeekHappyStamp, setThisWeekHappyStamp] = useState<number>(0);
  const [thisWeekStudyStamp, setThisWeekStudyStamp] = useState<number>(0);
  const [thisWeekExerciseStamp, setThisWeekExerciseStamp] = useState<number>(0);
  const [thisWeekMeditationStamp, setThisWeekMeditationStamp] = useState<number>(0);

  useEffect(() => {
    if (happList) {
      const thisWeekHappList = getThisWeekHapp(happList);
      const lastSevenDaysHappList = getLastSevenDaysHapp(happList);
      const thisMonthHappList = getThisMonthHapp(happList);
      
      const weekWakeUp = getAvrHappedAt(lastSevenDaysHappList.filter(
        happ => happ.UserStamp.Stamp.type === StampType.WAKE_UP
      ));
      const weekGoToBed = getAvrHappedAt(lastSevenDaysHappList.filter(
        happ => happ.UserStamp.Stamp.type === StampType.GO_TO_BED
      ));
      const monthWakeUp = getAvrHappedAt(thisMonthHappList.filter(
        happ => happ.UserStamp.Stamp.type === StampType.WAKE_UP
      ));
      const monthGoToBed = getAvrHappedAt(thisMonthHappList.filter(
        happ => happ.UserStamp.Stamp.type === StampType.GO_TO_BED
      ));

      const weekSleepingTime = getSleepTime(weekWakeUp, weekGoToBed);
      const monthSleepingTime = getSleepTime(monthWakeUp, monthGoToBed);

      const happyStamps = thisWeekHappList.filter(
        happ => happ.UserStamp.Stamp.type === StampType.HAPPY
      );
      const studyStamps = thisWeekHappList.filter(
        happ => happ.UserStamp.Stamp.type === StampType.STUDY
      );
      const exerciseStamps = thisWeekHappList.filter(
        happ => happ.UserStamp.Stamp.type === StampType.EXERCISE
      );
      const meditationStamps = thisWeekHappList.filter(
        happ => happ.UserStamp.Stamp.type === StampType.MEDITATION
      );

      setThisWeekWakeUp(weekWakeUp);
      setThisWeekGoToBed(weekGoToBed);
      setThisWeekSleeping(weekSleepingTime);
      
      setThisMonthWakeUp(monthWakeUp);
      setThisMonthGoToBed(monthGoToBed);
      setThisMonthSleeping(monthSleepingTime);
      
      setThisWeekHappyStamp(happyStamps.length);
      setThisWeekStudyStamp(studyStamps.length);
      setThisWeekExerciseStamp(exerciseStamps.length);
      setThisWeekMeditationStamp(meditationStamps.length);
    }
  }, [happList, TimeCtrllor.selectedDate]);

  return (
    <div className="h-[540px] overflow-y-auto container mx-auto p-2">
      <h1 className="text-2xl font-bold text-center mb-2">Summary</h1>

      <div className="grid grid-cols-1 lx:grid-cols-2 gap-1">
        {/* 이번주 해피스탬프 */}
        <div className="shadow-md rounded-lg p-2">
          <h2 className="text-lg font-semibold mb-2">이번주 스탬프</h2>
          <p>해피 스탬프: <span className="text-yellow-500">{thisWeekHappyStamp}</span></p>
          <p>공부 스탬프: <span className="text-yellow-500">{thisWeekStudyStamp}</span></p>
          <p>운동 스탬프: <span className="text-yellow-500">{thisWeekExerciseStamp}</span></p>
          <p>명상 스탬프: <span className="text-yellow-500">{thisWeekMeditationStamp}</span></p>
        </div>

        {/* 이번달 수입/지출 */}
        <div className="shadow-md rounded-lg p-2">
          <h2 className="text-lg font-semibold mb-2">이번달 재정</h2>
          <p>수입: <span className="text-red-500">0</span></p>
          <p>지출: <span className="text-red-500">0</span></p>
          <p>잔액: <span className="text-red-500">0</span></p>
        </div>

        {/* 이번주 수면 */}
        <div className="shadow-md rounded-lg p-2">
          <h2 className="text-lg font-semibold mb-2">이번주 수면</h2>
          <p>평균 기상 시간: <span className="text-blue-500">{thisWeekWakeUp}</span></p>
          <p>평균 취침 시간: <span className="text-blue-500">{thisWeekGoToBed}</span></p>
          <p>평균 수면 시간: <span className="text-blue-500">{thisWeekSleeping}</span></p>
        </div>

        {/* 이번달 수면 */}
        <div className="shadow-md rounded-lg p-2">
          <h2 className="text-lg font-semibold mb-2">이번달 수면</h2>
          <p>평균 기상 시간: <span className="text-green-500">{thisMonthWakeUp}</span></p>
          <p>평균 취침 시간: <span className="text-green-500">{thisMonthGoToBed}</span></p>
          <p>평균 수면 시간: <span className="text-green-500">{thisMonthSleeping}</span></p>
        </div>
      </div>
    </div>
  );
};

export default memo(observer(Main));
