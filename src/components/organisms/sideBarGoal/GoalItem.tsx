import Constants from '@/common/constants';
import { colorPalette } from '@/components/atoms/KeyValueHapp';
import { useHappState } from '@/context/happ';
import { Language, TimeCtrllor } from '@/mobx';
import { notoSans } from '@/styles/fonts';
import { Happ } from '@/types/Happ';
import { IntervalUnit, UserStamp } from '@/types/UserStamp';
import { 
  getGoalCount, 
  getGoalNumber, 
  getThisDateHapp, 
  getThisMonthHapp, 
  getThisWeekHapp,
} from '@/utils/happ.util';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import { LuGoal } from 'react-icons/lu';

interface Props {
  userStamp: UserStamp;
  className?: string;
}

const GoalItem: React.FC<Props> = ({ 
  userStamp,
  className,
}) => {
  const { happList } = useHappState();
  const [filteredHappList, setFilteredHappList] = useState<Happ[]>([]);

  const [color, setColor] = useState<{ bg: string; text: string }>({ bg: '#bfdbfe', text: '#1e3a8a' });

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 11);
    setColor(colorPalette[randomIndex]);
  }, []);

  useEffect(() => {
    let intervalFilteredList: Happ[] = [];
    switch (userStamp.goalInterval) {
    case IntervalUnit.Month:
      intervalFilteredList = getThisMonthHapp(happList, TimeCtrllor.selectedDate);
      break;
    case IntervalUnit.Week:
      intervalFilteredList = getThisWeekHapp(happList, TimeCtrllor.selectedDate);
      break;
    case IntervalUnit.Day:
      intervalFilteredList = getThisDateHapp(happList);
      break;
    }
    setFilteredHappList(intervalFilteredList.filter(
      happ => happ.UserStamp.id == userStamp.id
    ));
  }, [happList]);
  // const goUserStampDisplayPage = () => {
  //   router.push('/stamp/' + userStamp.id);
  //   // router.push('/stamp/update');
  // };

  return (
    <div
      className={cls(
        'p-1 flex flex-col',
        notoSans.className,
        className
      )}
    >   
      {/* 1열 */}
      <div className={cls('flex items-end justify-between mx-3')}>
        {/* Left */}
        <div 
          className={cls('flex items-center z-20')}
          style={{
            color: color.text,
          }}
        >
          <Image
            src={userStamp.Stamp.url}
            alt={userStamp.alias}
            className={cls(
              'rounded-full object-contain aspect-square z-10',
            )}
            width={33}
            height={33}
            priority
          />
          <div className={cls('mr-1')}>
            {Constants.SYMBOLS.X}
          </div>
          <p className={cls('font-semibold')}>
            {
              getThisWeekHapp(happList, TimeCtrllor.selectedDate).filter(
                happ => happ.UserStamp.id == userStamp.id
              ).length
            }
          </p>
        </div>

        {/* Right */}
        <div className={cls('flex items-center text-gray-600')}>
          
          <LuGoal className={cls('text-primary mx-1')} />
          {userStamp.existGoal && (
            <div className={cls('flex items-center')}>
              <p className={cls(
                'text-sm mx-1 bg-green-100 rounded-full'
              )}>
                {userStamp.goalInterval == IntervalUnit.Day && Language.$t.Statistics.Every}{Language.$t.Date[userStamp.goalInterval]}
              </p>
              { getGoalCount(userStamp.goalUnit, filteredHappList, userStamp.Stamp.type) }
              <p className='text-blue-700 px-1'>
                /
              </p>
              <p>
                { getGoalNumber(userStamp.goalUnit, userStamp.goalNumber) }
              </p>
              <p className={cls(
                'mx-1 bg-blue-100 rounded-full',
                'text-sm text-center'
              )}>
                {Language.$t.CounterUnit[userStamp.goalUnit]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2열 */}
      <div className={cls('-translate-y-3')}>
        <div
          className={cls(
            'px-1 border-4 rounded-md text-xl text-wrap',
            'flex items-center float-start mr-2'
          )}
          style={{
            color: color.text,
            backgroundColor: color.bg,
            borderColor: color.text,
          }}
        >
          {userStamp.alias}
        </div>
        <div 
          className={cls(
            'whitespace-pre-wrap border rounded-md',
            'mt-2 mx-2 p-1'
          )}
          style={{
            borderColor: color.text,
          }}
        >
          {userStamp.memo}
        </div>
      </div>
    </div>
  );
};

export default memo(observer(GoalItem));