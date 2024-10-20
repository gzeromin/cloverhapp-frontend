'use client';
import { Language, TimeCtrllor } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { memo, useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import Week from '@/components/organisms/happCalendar/Week';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { UserStamp } from '@/types/UserStamp';
import cls from 'classnames';
import HappSaveModal from '@/components/organisms/happCalendar/HappSaveModal';
import StampButton from '@/components/molecules/StampButton';
import { useAuthState } from '@/context/auth';

interface Props {
  className: string;
}

const HappCalendar: React.FC<Props> = ({ className }) => {
  const [showStampSaveModal, setShowStampSaveModal] = useState<boolean>(false);
  const [selectedUserStamp, setSelectedUserStamp] = useState<UserStamp>();
  const { userStamps } = useAuthState();

  const onClickStamp = (userStamp: UserStamp) => {
    setShowStampSaveModal(true);
    setSelectedUserStamp(userStamp);
  };

  const goBtnStyle = 'pt-5 px-2 cursor-pointer';
  const iconStyle = 'scale-150 hover:bg-gray-100 rounded-full';

  return (
    <div className={className}>
      <DndProvider backend={HTML5Backend}>
        <div
          className="flex justify-between whitespace-nowrap"
        >
          <div className="flex">
            {/* < */}
            <span className={goBtnStyle}>
              <AiOutlineLeft className={iconStyle} onClick={TimeCtrllor.goPrev} />
            </span>

            {/* 日付 text */}
            <span className="mx-0 my-2 text-center">
              <div
                style={{
                  fontSize: '25px',
                }}
              >
                <span
                  style={{
                    marginRight: '10px',
                  }}
                >
                  {Language.$t.Months[TimeCtrllor.selectedMonth]}
                </span>
                {TimeCtrllor.selectedYear}
              </div>
            </span>

            {/* > */}
            <span className={goBtnStyle}>
              <AiOutlineRight
                className={iconStyle}
                onClick={TimeCtrllor.goNext}
              />
            </span>
          </div>
          <div className={cls(
            className, 
            'flex items-center justify-start gap-3',
            'overflow-x-auto whitespace-nowrap'
          )}>
            {userStamps && userStamps.map((userStamp) => {
              if (userStamp.isDisplay) {
                return <StampButton
                  userStamp={userStamp}
                  key={`stampPalette-${userStamp.id}`}
                  onClickStamp={() => onClickStamp(userStamp)}
                  size={40}
                />;
              }
            })}
            {showStampSaveModal && (
              <HappSaveModal 
                userStampId={selectedUserStamp ? selectedUserStamp.id : undefined}
                closeModal={() => setShowStampSaveModal(false)}
              />
            )}
          </div>
        </div>
        <Week />
      </DndProvider>
    </div>
  );
};

export default memo(observer(HappCalendar));
