'use client';
import { memo, useState } from 'react';
import cls from 'classnames';
import StampButton from '@/components/molecules/StampButton';
import { fetcher } from '@/utils/api.util';
import { UserStamp } from '@/types/UserStamp';
import useSWR from 'swr';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HappSaveModal from './HappSaveModal';

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
      <DndProvider backend={HTML5Backend}>
        {userStamps && userStamps.map((userStamp) => 
          <StampButton
            userStamp={userStamp}
            key={`stampPalette-${userStamp.id}`}
            onClickStamp={() => onClickStamp(userStamp)}
            size={size}
          />
        )}
      </DndProvider>
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
