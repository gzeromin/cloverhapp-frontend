'use client';
import { memo, useState } from 'react';
import cls from 'classnames';
import StampButton from '../molecules/StampButton';
import HappSaveModal from '../molecules/HappSaveModal';
interface StampPaletteProps {
  className?: string;
  size?: number;
  mutateStamp?: () => void;
}
const stamps = [
  'happystamp',
  'morning',
  'drug',
  'meal',
  'meditation',
  'exercise',
  'english',
  'book',
  'savings',
  'water',
  'dream',
];
const StampPalette: React.FC<StampPaletteProps> = ({
  className,
  size = 45,
  mutateStamp,
}) => {
  const [showStampSaveModal, setShowStampSaveModal] = useState<boolean>(false);
  const [selectedStamp, setSelectedStamp] = useState<string>();

  const onClickStamp = (stamp: string) => {
    setShowStampSaveModal(true);
    setSelectedStamp(stamp);
  };
  return (
    <div className={cls(
      className, 
      'flex items-center justify-start gap-3',
      'overflow-x-auto whitespace-nowrap'
    )}>
      {stamps.map((stamp) => 
        <StampButton
          src={`https://elasticbeanstalk-us-east-1-149536466661.s3.amazonaws.com/cloverhapp/${stamp}.png`}
          key={`stampPalette-${stamp}`}
          alt={stamp}
          onClickStamp={() => onClickStamp(stamp)}
          size={size}
        />
      )}
      {showStampSaveModal && (

        <HappSaveModal 
          happName={selectedStamp}
          closeModal={() => setShowStampSaveModal(false)}
          mutateHapp={mutateStamp}
        />
      )}
    </div>
  );
};

export default memo(StampPalette);
