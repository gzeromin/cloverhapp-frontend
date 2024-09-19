'use client';
import { Language, TimeCtrllor } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { memo, useEffect } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import api from '@/utils/api.util';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';
import Week from '../organisms/happCalendar/Week';
import StampPalette from '../organisms/StampPalette';

interface Props {
  className: string;
}

const HappCalendar: React.FC<Props> = ({ className }) => {
  const dispatch = useAuthDispatch();
  const { user } = useAuthState();

  useEffect(() => {
    if(user)
      api
        .get(`/happ/list/${TimeCtrllor.selectedYear}/${user.id}`)
        .then((res) => {
          dispatch(AuthActionEnum.SET_HAPPLIST, res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [TimeCtrllor.selectedYear, user]);

  const goBtnStyle = 'text-gray pt-5 px-2';
  const iconStyle = 'scale-150';

  return (
    <div className={className} test-id='happCalendarComponent'>
      <div className="flex justify-between whitespace-nowrap">
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
        <StampPalette size={40}/>
      </div>
      <Week />
    </div>
  );
};

export default memo(observer(HappCalendar));
