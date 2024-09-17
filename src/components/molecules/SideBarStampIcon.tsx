'use client';
import cls from 'classnames';
import { UserIcon } from '@/types/UserIcon';

interface SideBarStampIconProps {
  userIcon: UserIcon;
  onClickStamp: () => void;
}

const SideBarStampIcon: React.FC<SideBarStampIconProps> = ({
  userIcon,
  onClickStamp,
}) => {
  return (
    <div
      className={cls(
        'text-center cursor-pointer rounded-md hover:shadow-lg hover:font-bold p-1',
        'hover:bg-primary-hover overflow-hidden text-ellipsis  whitespace-nowrap',
        'hover:text-wrap',
      )}
      id={userIcon.id}
      onClick={onClickStamp}
    >
      {/* <UserIconHapp
        className=""
        userIcon={userIcon}
        onClick={onClickStamp}
        size={100}
      /> */}
      <span className={cls('text-xs')}>{userIcon.alias}</span>
    </div>
  );
};

export default SideBarStampIcon;
