'use client';
import cls from 'classnames';
import { UserStamp } from '@/types/UserStamp';

interface SideBarStampProps {
  userStamp: UserStamp;
  onClickStamp: () => void;
}

const SideBarStamp: React.FC<SideBarStampProps> = ({
  userStamp,
  onClickStamp,
}) => {
  return (
    <div
      className={cls(
        'text-center cursor-pointer rounded-md hover:shadow-lg hover:font-bold p-1',
        'hover:bg-primary-hover overflow-hidden text-ellipsis  whitespace-nowrap',
        'hover:text-wrap',
      )}
      id={userStamp.id}
      onClick={onClickStamp}
    >
      {/* <UserStampHapp
        className=""
        userStamp={userStamp}
        onClick={onClickStamp}
        size={100}
      /> */}
      <span className={cls('text-xs')}>{userStamp.alias}</span>
    </div>
  );
};

export default SideBarStamp;
