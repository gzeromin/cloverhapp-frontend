'use client';
import { Language, TimeCtrllor } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { memo, useEffect, useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import api, { fetcher } from '@/utils/api.util';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';
import Week from '@/components/organisms/happCalendar/Week';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { UserStamp } from '@/types/UserStamp';
import useSWR from 'swr';
import cls from 'classnames';
import HappSaveModal from '@/components/organisms/happCalendar/HappSaveModal';
import StampButton from '@/components/molecules/StampButton';

interface Props {
  className: string;
}

const HappCalendar: React.FC<Props> = ({ className }) => {
  const dispatch = useAuthDispatch();
  const { user } = useAuthState();
  const [showStampSaveModal, setShowStampSaveModal] = useState<boolean>(false);
  const [selectedUserStamp, setSelectedUserStamp] = useState<UserStamp>();
  const { data: userStamps } = useSWR<UserStamp[]>('/user-stamp', fetcher);

  const onClickStamp = (userStamp: UserStamp) => {
    setShowStampSaveModal(true);
    setSelectedUserStamp(userStamp);
  };

  useEffect(() => {
    if(user)
      api
        .get(`/happ/list/${TimeCtrllor.formattedSelectedDate}/${user.id}`)
        .then((res) => {
          dispatch(AuthActionEnum.SET_HAPPLIST, res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [TimeCtrllor.formattedSelectedDate, user]);

  const goBtnStyle = 'text-gray pt-5 px-2 cursor-pointer hover:bg-gray-100 rounded-full';
  const iconStyle = 'scale-150';

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
            {userStamps && userStamps.map((userStamp) => 
              <StampButton
                userStamp={userStamp}
                key={`stampPalette-${userStamp.id}`}
                onClickStamp={() => onClickStamp(userStamp)}
                size={40}
              />
            )}
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
