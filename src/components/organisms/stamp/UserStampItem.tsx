import { Language } from '@/mobx';
import { notoSans } from '@/styles/fonts';
import { CounterUnit, UserStamp } from '@/types/UserStamp';
import dateUtils from '@/utils/date.util';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import { LuGoal } from 'react-icons/lu';

interface Props {
  userStamp: UserStamp;
  className?: string;
  isDisplay?: boolean;
}

const UserStampItem: React.FC<Props> = ({ 
  userStamp,
  className,
  isDisplay,
}) => {
  const router = useRouter();

  const goUserStampUpdatePage = () => {
    router.push('/stamp/' + userStamp.id);
    // router.push('/stamp/update');
  };

  const getGoalNumber = () => {
    const goalNumber = userStamp.goalNumber;
    if (userStamp.goalUnit == CounterUnit.Time) {
      return dateUtils.getFormatHourMinByMinutes(Number(goalNumber));
    }
    return goalNumber;
  };
  
  return (
    <div
      className={cls(
        notoSans.className,
        className
      )}
    >
      <div
        className={cls(
          'flex items-center',
          'border m-2 rounded',
          'hover:bg-primary-100 cursor-pointer',
          isDisplay ? 'bg-green-50' : 'bg-blue-50'
        )}
        onClick={goUserStampUpdatePage}
      >
        <div className={cls('flex items-center w-3/4')}>
          <p className={cls('mx-2')}>
            {userStamp.displayOrder}
          </p>
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
          <p className={cls('mr-3')}>
            {userStamp.alias}
          </p>
        </div>
        {userStamp.existGoal && (
          <div className={cls('flex items-center w-1/2')}>
            <LuGoal className={cls('text-primary')}/>
            <p className={cls('text-sm mx-1 px-1 bg-green-100 rounded-full')}>
              {Language.$t.Date[userStamp.goalInterval]}
            </p>
            <p>
              {getGoalNumber()}
            </p>
            <p className={cls(
              'mx-1 px-1 bg-blue-100 rounded-full',
              'text-xs text-center'
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