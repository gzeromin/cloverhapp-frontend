import { useAuthState } from '@/context/auth';
import { Language, TimeCtrllor } from '@/mobx';
import { notoSans } from '@/styles/fonts';
import { Happ } from '@/types/Happ';
import { StampStatus } from '@/types/Stamp';
import { IntervalUnit, UserStamp } from '@/types/UserStamp';
import { 
  getGoalCount, 
  getGoalNumber, 
  getThisDateHapp, 
  getThisMonthHapp, 
  getThisWeekHapp
} from '@/utils/happ.util';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import { GoPeople } from 'react-icons/go';
import { RxLockClosed, RxLockOpen2 } from 'react-icons/rx';

interface Props {
  userStamp: UserStamp;
  className?: string;
}

const UserStampItem: React.FC<Props> = ({ 
  userStamp,
  className,
}) => {
  const { happList } = useAuthState();
  const [filteredHappList, setFilteredHappList] = useState<Happ[]>([]);
  const router = useRouter();

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

  const getUserStampStatus = () => {
    switch (userStamp.status) {
    case StampStatus.PRIVATE:
      return <RxLockClosed className='text-sm text-primary'/>;
    case StampStatus.FRIEND:
      return <GoPeople className='text-sm text-blue-700'/>;
    case StampStatus.PUBLIC:
      return <RxLockOpen2 className='text-sm text-green-700'/>;
    }
  };

  return (
    <div
      className={cls(
        'p-1',
        notoSans.className,
        className
      )}
    >
      <div
        className={cls(
          'flex items-center rounded-md',
          'hover:bg-primary-100 cursor-pointer',
        )}
        // onClick={goUserStampUpdatePage}
      >
        <div className={cls('flex items-center')}>
          <Image
            src={userStamp.Stamp.url}
            alt={userStamp.alias}
            className={cls(
              'rounded-full object-contain aspect-square',
            )}
            width={33}
            height={33}
            priority
          />
          <p className={cls('text-primary mr-1')}>
            x
          </p>
          <p>
            {
              getThisWeekHapp(happList, TimeCtrllor.selectedDate).filter(
                happ => happ.UserStamp.id == userStamp.id
              ).length
            }
          </p>
        </div>
        <div className={cls('rounded-full bg-pink-50 ml-1 mr-2')}>
          { getUserStampStatus() }
        </div>
        {userStamp.existGoal && (
          <div className={cls('flex items-center')}>
            <p className={cls(
              'text-sm mx-1 bg-green-100 rounded-full'
            )}>
              {Language.$t.Date[userStamp.goalInterval]}
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
  );
};

export default memo(observer(UserStampItem));