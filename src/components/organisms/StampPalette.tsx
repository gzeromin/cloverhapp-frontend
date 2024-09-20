'use client';
import { memo, useState } from 'react';
import cls from 'classnames';
import StampButton from '../molecules/StampButton';
import HappSaveModal from '../molecules/HappSaveModal';
import { fetcher } from '@/utils/api.util';
import { UserStamp } from '@/types/UserStamp';
import useSWR from 'swr';

interface StampPaletteProps {
  className?: string;
  size?: number;
  mutateStamp?: () => void;
}
const StampPalette: React.FC<StampPaletteProps> = ({
  className,
  size = 45,
  mutateStamp,
}) => {
  const [showStampSaveModal, setShowStampSaveModal] = useState<boolean>(false);
  const [selectedUserStamp, setSelectedUserStamp] = useState<UserStamp>();
  const { data: userStamps } = useSWR<UserStamp[]>('/user-stamp', fetcher);


  const onClickStamp = (userStamp: UserStamp) => {
    setShowStampSaveModal(true);
    setSelectedUserStamp(userStamp);
  };
  
  return (
    <div className={cls(
      className, 
      'flex items-center justify-start gap-3',
      'overflow-x-auto whitespace-nowrap'
    )}>
      {userStamps && userStamps.map((userStamp) => 
        <StampButton
          src={userStamp.Stamp.url}
          key={`stampPalette-${userStamp.id}`}
          alt={userStamp.alias}
          onClickStamp={() => onClickStamp(userStamp)}
          size={size}
        />
      )}
      {showStampSaveModal && (
        <HappSaveModal 
          userStamp={selectedUserStamp}
          closeModal={() => setShowStampSaveModal(false)}
          mutateHapp={mutateStamp}
        />
      )}
    </div>
  );
};

export default memo(StampPalette);
